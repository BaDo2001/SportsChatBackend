import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export default class Team {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  shortName!: string;

  @Field(() => String)
  logo!: string;
}
