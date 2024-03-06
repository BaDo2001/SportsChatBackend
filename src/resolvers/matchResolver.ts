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
import MatchService from "@/services/MatchService";
import DailySummary, { DailySummaryUpdate } from "@/types/DailySummary";
import DailySummaryArgs from "@/types/DailySummaryArgs";
import { MatchWithEvents } from "@/types/Match";
import MatchEvent from "@/types/MatchEvent";

export const UPDATE_MATCH_SUMMARIES_TOPIC = "UPDATE_MATCH_SUMMARIES";
export const UPDATE_MATCH_TOPIC = (matchId: number) =>
  `UPDATE_MATCH_${matchId}`;

@Resolver()
export default class MatchResolver {
  @lazyInject(MatchService)
  matchService: MatchService;

  @Query(() => DailySummary)
  async dailySummaries(
    @Args(() => DailySummaryArgs) { date, cursor, size }: DailySummaryArgs,
  ): Promise<DailySummary> {
    try {
      const matches = await this.matchService.getDailyMatches(
        DateTime.fromJSDate(date),
        cursor,
        size + 1,
      );

      return {
        matches: matches.slice(
          0,
          matches.length > size ? size : matches.length,
        ),
        pageInfo: {
          hasNextPage: matches.length > size,
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
      return await this.matchService.getMatchEvents(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Subscription(() => DailySummaryUpdate, {
    topics: UPDATE_MATCH_SUMMARIES_TOPIC,
  })
  updateMatches(@Root() data: DailySummaryUpdate): DailySummaryUpdate {
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
