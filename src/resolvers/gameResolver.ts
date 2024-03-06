import { DateTime } from "luxon";
import {
  Arg,
  Args,
  Int,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";

import { lazyInject } from "@/container";
import GamesService from "@/services/GamesService";
import DailySummary, { DailySummaryUpdate } from "@/types/DailySummary";
import DailySummaryArgs from "@/types/DailySummaryArgs";
import { MatchWithEvents } from "@/types/Match";
import MatchEvent from "@/types/MatchEvent";

export const UPDATE_MATCH_SUMMARIES_TOPIC = "UPDATE_MATCH_SUMMARIES";
export const UPDATE_MATCH_TOPIC = (matchId: number) =>
  `UPDATE_MATCH_${matchId}`;

@Resolver()
export default class GameResolver {
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
        games: games.slice(0, games.length > size ? size : games.length),
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

  @Query(() => [MatchEvent])
  async matchEvents(@Arg("id", () => Int) id: number): Promise<MatchEvent[]> {
    try {
      return await this.gamesService.getMatchEvents(id);
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

  @Subscription(() => MatchWithEvents, {
    topics: ({ args }) => UPDATE_MATCH_TOPIC(args.id),
  })
  updateMatch(
    @Arg("id", () => Int) _id: number,
    @Root() match: MatchWithEvents,
  ): MatchWithEvents {
    return match;
  }
}
