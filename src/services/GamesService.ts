import { injectable } from "inversify";
import type { DateTime } from "luxon";

import { prisma } from "@/db";
import { createGames } from "@/mock/gamesFactory";
import type Match from "@/types/Match";

@injectable()
export default class GamesService {
  async getDailyGames(
    date: DateTime,
    offset: number,
    limit: number,
  ): Promise<Match[]> {
    // const { data } = await getScheduleSummaries<
    //   AxiosResponse<ScheduleSummariesResponseOne>
    // >(
    //   "en",
    //   date.toISOString().split("T")[0],
    //   {
    //     offset,
    //     limit,
    //   },
    //   {
    //     baseURL: "https://api.sportradar.com/soccer-extended/trial/v4",
    //     params: {
    //       api_key: process.env.SPORTRADAR_API_KEY,
    //     },
    //     headers: {
    //       accept: "application/json",
    //     },
    //   },
    // );

    const startDate = date.toUTC().startOf("day").toJSDate();
    const endDate = date.toUTC().endOf("day").toJSDate();

    const matches = await prisma.match.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        startDate: "asc",
      },
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

    if (matches.length) {
      return matches as Match[];
    }

    const mockMatches = createGames(date);

    const competitions = Array.from(
      new Set(mockMatches.map((match) => match.competition)).values(),
    );

    await prisma.competition.createMany({
      data: competitions,
      skipDuplicates: true,
    });

    const teams = Array.from(
      new Set(
        mockMatches.flatMap((match) => [match.homeTeam, match.awayTeam]),
      ).values(),
    );

    await prisma.team.createMany({
      data: teams,
      skipDuplicates: true,
    });

    await prisma.match.createMany({
      data: mockMatches.map((match) => ({
        id: match.id,
        startDate: match.startDate,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        periodStart: match.periodStart,
        status: match.status,
        homeTeamId: match.homeTeam.id,
        awayTeamId: match.awayTeam.id,
        competitionId: match.competition.id,
      })),
      skipDuplicates: true,
    });

    return mockMatches.slice(offset, offset + limit);
  }
}
