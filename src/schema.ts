import { buildSchema, GraphQLISODateTime } from "type-graphql";

import DailySummaryResolver from "./resolvers/dailySummaryResolver";
import MessageResolver from "./resolvers/messageResolver";
import UserResolver from "./resolvers/userResolver";
import type { Context } from "./context";

export default async function getSchema() {
  return buildSchema({
    resolvers: [DailySummaryResolver, MessageResolver, UserResolver],
    emitSchemaFile: true,
    scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
    authChecker: ({ context }: { context: Context }) => !!context.user,
  });
}
