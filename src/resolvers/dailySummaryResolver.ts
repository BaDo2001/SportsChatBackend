import { DateTime } from "luxon";
import { Args, Query, Resolver, Root, Subscription } from "type-graphql";

import { lazyInject } from "@/container";
import GamesService from "@/services/GamesService";
import DailySummary, { DailySummaryUpdate } from "@/types/DailySummary";
import DailySummaryArgs from "@/types/DailySummaryArgs";

export const UPDATE_MATCH_SUMMARIES_TOPIC = "UPDATE_MATCH_SUMMARIES";

@Resolver()
export default class DailySummaryResolver {
  @lazyInject(GamesService)
  gamesService: GamesService;

  @Query(() => DailySummary)
  async dailySummaries(
    @Args(() => DailySummaryArgs) { date, cursor, size }: DailySummaryArgs,
  ): Promise<DailySummary> {
    try {
      const games = await this.gamesService.getDailyGames(
        DateTime.fromJSDate(date),
        cursor,
        size + 1,
      );

      return {
        games: games.slice(0, -1),
        pageInfo: {
          hasNextPage: games.length > size,
          endCursor: cursor + size,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Subscription(() => DailySummaryUpdate, {
    topics: UPDATE_MATCH_SUMMARIES_TOPIC,
  })
  updateGames(@Root() data: DailySummaryUpdate): DailySummaryUpdate {
    return data;
  }
}
