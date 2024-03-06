import { MatchStatus } from "@prisma/client";
import { injectable } from "inversify";
import { DateTime } from "luxon";
import cron from "node-cron";

import { container } from "@/container";
import { prisma } from "@/db";
import { pubSub } from "@/redis";
import {
  UPDATE_MATCH_SUMMARIES_TOPIC,
  UPDATE_MATCH_TOPIC,
} from "@/resolvers/matchResolver";
import type Match from "@/types/Match";
import type { MatchWithEvents } from "@/types/Match";
import type MatchEvent from "@/types/MatchEvent";

import { mapCompetition } from "./SportsApi/mappers/competition";
import { mapMatch } from "./SportsApi/mappers/match";
import { mapMatchEvents } from "./SportsApi/mappers/matchEvent";
import { mapMatchStatus } from "./SportsApi/mappers/matchStatus";
import { mapTeam } from "./SportsApi/mappers/team";
import { SportsApi } from "./SportsApi";

@injectable()
export default class MatchService {
  private async loadMatchesFromApi(date: DateTime): Promise<void> {
    const dayLoaded = await prisma.daysLoaded.findUnique({
      where: {
        day: date.toISODate() ?? "",
      },
    });

    if (dayLoaded) {
      return;
    }

    const matchesFromApi = await SportsApi.getMatches(date);

    const competitions = Array.from(
      new Set(matchesFromApi.map((match) => match.league)).values(),
    );

    await prisma.competition.createMany({
      data: competitions.map(mapCompetition),
      skipDuplicates: true,
    });

    const teams = Array.from(
      new Set(
        matchesFromApi.flatMap((match) => [match.teams.home, match.teams.away]),
      ).values(),
    );

    await prisma.team.createMany({
      data: teams.map(mapTeam),
      skipDuplicates: true,
    });

    await prisma.match.createMany({
      data: matchesFromApi.map(mapMatch),
      skipDuplicates: true,
    });

    await prisma.daysLoaded.create({
      data: {
        day: date.toISODate() ?? "",
      },
    });
  }

  private async getMatchesFromDb(
    date: DateTime,
    offset: number,
    limit: number,
  ): Promise<Match[]> {
    const startDate = date.toJSDate();
    const endDate = date.plus({ day: 1 }).toJSDate();

    const matches = await prisma.match.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          startDate: "asc",
        },
        {
          id: "asc",
        },
      ],
      where: {
        startDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
      },
    });

    return matches;
  }

  async getDailyMatches(
    date: DateTime,
    offset: number,
    limit: number,
  ): Promise<Match[]> {
    await this.loadMatchesFromApi(date);

    return this.getMatchesFromDb(date, offset, limit);
  }

  async refreshLiveMatches(): Promise<MatchWithEvents[]> {
    await this.loadMatchesFromApi(DateTime.now());

    const liveMatches = await SportsApi.getLiveMatches();

    const liveMatchesMap = new Map(
      liveMatches.map((match) => [match.fixture.id, match]),
    );

    const finishedMatches = await prisma.match.findMany({
      where: {
        id: {
          notIn: liveMatches.map((match) => match.fixture.id),
        },
        status: {
          equals: MatchStatus.SECOND_HALF,
        },
      },
    });

    if (liveMatches.length === 0 && finishedMatches.length === 0) {
      return [];
    }

    if (finishedMatches.length > 0) {
      await prisma.match.updateMany({
        where: {
          id: {
            in: finishedMatches.map((match) => match.id),
          },
        },
        data: {
          status: MatchStatus.FINISHED,
        },
      });
    }

    if (liveMatches.length === 0) {
      const finishedMatchData = await prisma.match.findMany({
        where: {
          id: {
            in: finishedMatches.map((match) => match.id),
          },
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
        },
      });

      return finishedMatchData.map((match) => ({
        ...match,
        events: [],
      }));
    }

    await prisma.$transaction(
      liveMatches.map((match) =>
        prisma.match.update({
          where: {
            id: match.fixture.id,
          },
          data: {
            homeScore: match.goals.home ?? 0,
            awayScore: match.goals.away ?? 0,
            elapsed: match.fixture.status.elapsed ?? 0,
            status: mapMatchStatus(match.fixture.status.short),
          },
        }),
      ),
    );

    const matches = await prisma.match.findMany({
      where: {
        id: {
          in: [
            ...liveMatches.map((match) => match.fixture.id),
            ...finishedMatches.map((match) => match.id),
          ],
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
      },
    });

    return matches.map((match) => {
      const matchDetails = liveMatchesMap.get(match.id);

      return {
        ...match,
        events: matchDetails
          ? mapMatchEvents(matchDetails.events, match.id)
          : [],
      };
    });
  }

  async getMatchEvents(id: number): Promise<MatchEvent[]> {
    const matchDetails = await SportsApi.getFixtureEvents(id);

    return mapMatchEvents(matchDetails.response, id);
  }
}

cron.schedule("* * * * *", async () => {
  try {
    if (process.env.DISABLE_POLLING === "true") {
      return;
    }

    const updates = await container.get(MatchService).refreshLiveMatches();

    if (updates.length > 0) {
      await pubSub.publish(UPDATE_MATCH_SUMMARIES_TOPIC, {
        matches: updates,
      });

      await Promise.all(
        updates.map((match) =>
          pubSub.publish(UPDATE_MATCH_TOPIC(match.id), match),
        ),
      );
    }
  } catch (error) {
    console.error(error);
  }
});
