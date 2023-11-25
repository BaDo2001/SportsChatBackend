import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export default class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  avatar!: string;
}
