import { Field, ID, InputType, ObjectType } from "type-graphql";

import User from "./User";

@InputType()
@ObjectType()
export class MessageInput {
  @Field(() => String)
  text!: string;
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
