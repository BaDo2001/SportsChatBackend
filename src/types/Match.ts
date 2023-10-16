import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import Competition from "./Competition";
import Team from "./Team";

export enum MatchStatus {
  FINISHED = "FINISHED",
  SCHEDULED = "SCHEDULED",
  IN_PLAY = "IN_PLAY",
  HALFTIME = "HALFTIME",
  CANCELED = "CANCELED",
  POSTPONED = "POSTPONED",
  EXTRA_TIME = "EXTRA_TIME",
  PENALTY_SHOOTOUT = "PENALTY_SHOOTOUT",
  EXTRA_TIME_BREAK = "EXTRA_TIME_BREAK",
}

registerEnumType(MatchStatus, {
  name: "MatchStatus",
});

@ObjectType()
export default class Match {
  @Field(() => ID)
  id!: string;

  @Field()
  homeTeam!: Team;

  @Field()
  awayTeam!: Team;

  @Field()
  homeScore!: number;

  @Field()
  awayScore!: number;

  @Field()
  startDate!: Date;

  @Field(() => MatchStatus)
  status!: MatchStatus;

  @Field()
  periodStart!: Date;

  @Field()
  competition!: Competition;
}
