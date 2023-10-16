import { Field, ObjectType } from "type-graphql";

import Match from "./Match";

@ObjectType()
export default class DailySummary {
  @Field(() => [Match])
  games: Match[];

  @Field(() => Number)
  totalGames: number;
}
