import { Field, ObjectType } from "type-graphql";

import Match from "./Match";
import PageInfo from "./PageInfo";

@ObjectType()
export default class DailySummary {
  @Field(() => [Match])
  games: Match[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
