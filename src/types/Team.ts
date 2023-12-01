import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class Team {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  logo!: string;
}
