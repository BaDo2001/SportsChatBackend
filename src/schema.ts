import { buildSchema, GraphQLISODateTime } from "type-graphql";

import MatchResolver from "./resolvers/matchResolver";
import MessageResolver from "./resolvers/messageResolver";
import UserResolver from "./resolvers/userResolver";
import type { Context } from "./context";
import { pubSub } from "./redis";

export default async function getSchema() {
  return buildSchema({
    resolvers: [MatchResolver, MessageResolver, UserResolver],
    emitSchemaFile: true,
    scalarsMap: [{ type: Date, scalar: GraphQLISODateTime }],
    authChecker: ({ context }: { context: Context }) => !!context.user,
    pubSub,
  });
}
