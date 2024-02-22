import { Field, ObjectType } from "type-graphql";

import Match from "./Match";
import Message from "./Message";

@ObjectType()
export class IsGroupMemberResponse {
  @Field(() => Boolean)
  isMember!: boolean;
}

@ObjectType()
export class Group {
  @Field(() => Match)
  match!: Match;

  @Field(() => Message)
  lastMessage!: Message;
}
