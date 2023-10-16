import { DateTime } from "luxon";
import { Args, Query, Resolver } from "type-graphql";

import DailySummary from "@/types/DailySummary";
import DailySummaryArgs from "@/types/DailySummaryArgs";

import { createGames } from "../../mockData/gamesFactory";

@Resolver(DailySummary)
export default class DailySummaryResolver {
  @Query(() => DailySummary)
  async dailySummaries(
    @Args() { date, limit, offset }: DailySummaryArgs,
  ): Promise<DailySummary> {
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

    // console.log(JSON.stringify(data, null, 2));

    const games = createGames(DateTime.fromJSDate(date));

    return {
      games: games.slice(offset, offset + limit),
      totalGames: games.length,
    };
  }
}
