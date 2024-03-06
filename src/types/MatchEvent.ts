import { Field, Int, ObjectType, registerEnumType } from "type-graphql";

import Player from "./Player";
import Team from "./Team";

export enum MatchEventType {
  Goal = "Goal",
  OwnGoal = "OwnGoal",
  Penalty = "Penalty",
  YellowCard = "YellowCard",
  RedCard = "RedCard",
  Substitution = "Substitution",
  Var = "Var",
}

registerEnumType(MatchEventType, {
  name: "MatchEventType",
});

@ObjectType()
class EventTime {
  @Field(() => Int)
  elapsed!: number;

  @Field(() => Int, { nullable: true })
  extra!: number | null;
}

@ObjectType()
export default class MatchEvent {
  @Field(() => String)
  id!: string;

  @Field(() => EventTime)
  time!: EventTime;

  @Field(() => Team)
  team!: Team;

  @Field(() => Player)
  player!: Player;

  @Field(() => Player, { nullable: true })
  assist!: Player | null;

  @Field(() => MatchEventType)
  type!: MatchEventType;

  @Field(() => String, { nullable: true })
  detail!: string | null;
}
