import axios from "axios";
import type { DateTime } from "luxon";

import type {
  ApiFixtureEventsResponse,
  ApiGamesResponse,
  ApiLiveResponse,
} from "./types";

const leagues = [
  78, // Bundesliga
  39, // Premier League
  140, // La Liga
  135, // Serie A
  61, // Ligue 1
  2, // Champions League
  3, // Europa League
  88, // Eredivisie
  94, // Primeira Liga
];

const baseUrl = "https://api-football-v1.p.rapidapi.com/v3";
const headers = {
  "x-rapidapi-key": process.env.SPORTS_API_KEY,
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

const getGames = async (date: DateTime) => {
  const { data } = await axios.get<ApiGamesResponse>(`${baseUrl}/fixtures`, {
    params: {
      date: date.toISODate(),
      timezone: "Europe/Budapest",
    },
    headers,
  });

  return data.response.filter((match) => leagues.includes(match.league.id));
};

const getLiveGames = async () => {
  const { data } = await axios.get<ApiLiveResponse>(`${baseUrl}/fixtures`, {
    params: {
      timezone: "Europe/Budapest",
      live: leagues.join("-"),
    },
    headers,
  });

  return data.response.filter((match) => leagues.includes(match.league.id));
};

const getFixtureEvents = async (fixtureId: number) => {
  const { data } = await axios.get<ApiFixtureEventsResponse>(
    `${baseUrl}/fixtures/events`,
    {
      params: {
        fixture: fixtureId,
      },
      headers,
    },
  );

  return data;
};

export const SportsApi = {
  getGames,
  getLiveGames,
  getFixtureEvents,
};
