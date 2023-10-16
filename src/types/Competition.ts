import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export default class Competition {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  logo!: string;
}
