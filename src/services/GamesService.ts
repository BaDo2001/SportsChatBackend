import { MatchStatus } from "@prisma/client";
import { injectable } from "inversify";
import { DateTime } from "luxon";
import cron from "node-cron";

import { container } from "@/container";
import { prisma } from "@/db";
import { pubSub } from "@/redis";
import { UPDATE_MATCH_SUMMARIES_TOPIC } from "@/resolvers/dailySummaryResolver";
import type Match from "@/types/Match";

import { mapApiStatusToMatchStatus, SportsApi } from "./SportsApi";

@injectable()
export default class GamesService {
  private async loadGamesFromApi(date: DateTime): Promise<void> {
    const dayLoaded = await prisma.daysLoaded.findUnique({
      where: {
        day: date.toISODate() ?? "",
      },
    });

    if (dayLoaded) {
      return;
    }

    const gamesFromApi = await SportsApi.getGames(date);

    const competitions = Array.from(
      new Set(gamesFromApi.map((match) => match.league)).values(),
    );

    await prisma.competition.createMany({
      data: competitions.map((competition) => ({
        id: competition.id,
        name: competition.name,
        logo: competition.logo,
      })),
      skipDuplicates: true,
    });

    const teams = Array.from(
      new Set(
        gamesFromApi.flatMap((match) => [match.teams.home, match.teams.away]),
      ).values(),
    );

    await prisma.team.createMany({
      data: teams.map((team) => ({
        id: team.id,
        name: team.name,
        logo: team.logo,
      })),
      skipDuplicates: true,
    });

    await prisma.match.createMany({
      data: gamesFromApi.map((match) => ({
        id: match.fixture.id,
        startDate: match.fixture.date,
        homeScore: match.goals.home ?? 0,
        awayScore: match.goals.away ?? 0,
        homeTeamId: match.teams.home.id,
        awayTeamId: match.teams.away.id,
        competitionId: match.league.id,
        elapsed: match.fixture.status.elapsed ?? 0,
        status: mapApiStatusToMatchStatus(match.fixture.status.short),
      })),
      skipDuplicates: true,
    });

    await prisma.daysLoaded.create({
      data: {
        day: date.toISODate() ?? "",
      },
    });
  }

  private async getGamesFromDb(
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

  async getDailyGames(
    date: DateTime,
    offset: number,
    limit: number,
  ): Promise<Match[]> {
    await this.loadGamesFromApi(date);

    return this.getGamesFromDb(date, offset, limit);
  }

  async refreshLiveGames(): Promise<Match[]> {
    await this.loadGamesFromApi(DateTime.now());

    const liveMatches = await SportsApi.getLiveGames();

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
      return prisma.match.findMany({
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
            status: mapApiStatusToMatchStatus(match.fixture.status.short),
          },
        }),
      ),
    );

    return prisma.match.findMany({
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
  }
}

cron.schedule("* * * * *", async () => {
  try {
    if (process.env.DISABLE_POLLING === "true") {
      return;
    }

    const updates = await container.get(GamesService).refreshLiveGames();

    if (updates.length > 0) {
      await pubSub.publish(UPDATE_MATCH_SUMMARIES_TOPIC, {
        games: updates,
      });
    }
  } catch (error) {
    console.error(error);
  }
});
