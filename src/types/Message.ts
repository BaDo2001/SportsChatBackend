import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

import User from "./User";

@InputType()
@ObjectType()
export class MessageInput {
  @Field(() => String)
  text!: string;

  @Field(() => Int)
  elapsed!: number;
}

@ObjectType()
export default class Message extends MessageInput {
  @Field(() => ID)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => User)
  author!: User;
}
