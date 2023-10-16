import { buildSchema, GraphQLISODateTime } from "type-graphql";

import DailySummaryResolver from "./resolvers/dailySummaryResolver";

export default async function getSchema() {
  return buildSchema({
    resolvers: [DailySummaryResolver],
    emitSchemaFile: true,
    scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
  });
}
