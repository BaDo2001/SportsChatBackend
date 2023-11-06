import { DateTime } from "luxon";
import { Args, Query, Resolver } from "type-graphql";

import { lazyInject } from "@/container";
import GamesService from "@/services/GamesService";
import DailySummary from "@/types/DailySummary";
import DailySummaryArgs from "@/types/DailySummaryArgs";

@Resolver(DailySummary)
export default class DailySummaryResolver {
  @lazyInject(GamesService)
  gamesService: GamesService;

  @Query(() => DailySummary)
  async dailySummaries(
    @Args(() => DailySummaryArgs) { date, cursor, size }: DailySummaryArgs,
  ): Promise<DailySummary> {
    const games = await this.gamesService.getDailyGames(
      DateTime.fromJSDate(date),
      cursor,
      size + 1,
    );

    return {
      games: games.slice(0, size),
      pageInfo: {
        hasNextPage: games.length > size,
        endCursor: cursor + size,
      },
    };
  }
}
