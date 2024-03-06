import { Field, ObjectType } from "type-graphql";

import Match from "./Match";
import PageInfo from "./PageInfo";

@ObjectType()
export class DailySummaryUpdate {
  @Field(() => [Match])
  matches: Match[];
}

@ObjectType()
export default class DailySummary extends DailySummaryUpdate {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
