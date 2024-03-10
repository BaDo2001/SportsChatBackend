import { MatchStatus } from "@prisma/client";
import { Field, Int, ObjectType, registerEnumType } from "type-graphql";

import Competition from "./Competition";
import MatchEvent from "./MatchEvent";
import Team from "./Team";

registerEnumType(MatchStatus, {
  name: "MatchStatus",
});

@ObjectType()
export default class Match {
  @Field(() => Int)
  id!: number;

  @Field(() => Team)
  homeTeam!: Team;

  @Field(() => Team)
  awayTeam!: Team;

  @Field(() => Number)
  homeScore!: number;

  @Field(() => Number)
  awayScore!: number;

  @Field(() => Number)
  homeScoreHalfTime!: number;

  @Field(() => Number)
  awayScoreHalfTime!: number;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => MatchStatus)
  status!: MatchStatus;

  @Field(() => Int)
  elapsed!: number;

  @Field(() => Competition)
  competition!: Competition;
}

@ObjectType()
export class MatchWithEvents extends Match {
  @Field(() => [MatchEvent])
  events!: MatchEvent[];
}
