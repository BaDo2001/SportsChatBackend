import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class Player {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;
}
