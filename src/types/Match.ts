import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import Competition from "./Competition";
import Team from "./Team";

export enum MatchStatus {
  FINISHED = "FINISHED",
  SCHEDULED = "SCHEDULED",
  FIRST_HALF = "FIRST_HALF",
  HALFTIME = "HALFTIME",
  SECOND_HALF = "SECOND_HALF",
  // CANCELED = "CANCELED",
  // POSTPONED = "POSTPONED",
  // EXTRA_TIME = "EXTRA_TIME",
  // PENALTY_SHOOTOUT = "PENALTY_SHOOTOUT",
  // EXTRA_TIME_BREAK = "EXTRA_TIME_BREAK",
}

registerEnumType(MatchStatus, {
  name: "MatchStatus",
});

@ObjectType()
export default class Match {
  @Field(() => ID)
  id!: string;

  @Field(() => Team)
  homeTeam!: Team;

  @Field(() => Team)
  awayTeam!: Team;

  @Field(() => Number)
  homeScore!: number;

  @Field(() => Number)
  awayScore!: number;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => MatchStatus)
  status!: MatchStatus;

  @Field(() => Date)
  periodStart!: Date;

  @Field(() => Competition)
  competition!: Competition;
}
