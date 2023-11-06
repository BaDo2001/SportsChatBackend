import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class PageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Int)
  endCursor: number;
}
