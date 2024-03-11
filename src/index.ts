import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import { WebSocketServer } from "ws";

import { type Context, getContext } from "./context";
import getSchema from "./schema";

import "dotenv/config";

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const schema = await getSchema();

  const serverCleanup = useServer(
    {
      schema,
      context: (args) => {
        console.log("Getting context for connection", args.connectionParams);

        return getContext(
          args.connectionParams?.Authorization as string | undefined,
        );
      },
    },
    wsServer,
  );

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({
        footer: false,
        embed: {
          initialState: {
            pollForSchemaUpdates: false,
          },
        },
      }),
    ],
    logger: console,
    introspection: true,
  });

  await server.start();

  app.use(
    auth({
      issuerBaseURL: process.env.AUTH0_DOMAIN,
      audience: process.env.AUTH0_AUDIENCE,
      authRequired: false,
    }),
  );

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        if (!req.auth) {
          return {};
        }

        return getContext(req.headers.authorization!);
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5001 }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:5001/graphql`);
}

main();
