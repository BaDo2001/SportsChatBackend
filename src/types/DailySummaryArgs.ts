import { Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export default class DailySummaryArgs {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  offset: number;

  @Field(() => Int, { defaultValue: 10 })
  @Min(1)
  @Max(50)
  limit: number;

  @Field()
  date: Date;
}
