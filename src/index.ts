import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";

import getSchema from "./schema";

import "dotenv/config";

type MyContext = {
  token?: string;
};

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = await getSchema();

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    logger: console,
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

main();

// getScheduleSummaries(
//   "en",
// new Date().toISOString().split("T")[0],
// {
//   offset: 0,
//   limit: 10,
// },
// {
//   baseURL: "https://api.sportradar.com/soccer-extended/trial/v4",
//   params: {
//     api_key: process.env.SPORTRADAR_API_KEY,
//   },
//   headers: {
//     accept: "application/json",
//   },
//   },
// ).then((res) => console.log(res.data));

// getStreamEvents(
//   {
//     event_id: [
//       "match_started",
//       "match_ended",
//       "break_start",
//       "injury",
//       "penalty_awarded",
//       "penalty_missed",
//       "score_change",
//       "substitution",
//       "period_start",
//       "red_card",
//       "yellow_card",
//     ],
//   },
//   {
//     baseURL: "https://api.sportradar.com/soccer-extended/trial/v4",
//     params: {
//       api_key: process.env.SPORTRADAR_API_KEY,
//     },
//     headers: {
//       accept: "application/json",
//     },
//     maxRedirects: 10,
//   },
// ).then((res) => {
//   console.log(res.data);
// });
