import { MatchStatus } from "@prisma/client";
import axios from "axios";
import type { DateTime } from "luxon";

type SportsApiStatus = "NS" | "1H" | "HT" | "2H" | "FT";

export const mapApiStatusToMatchStatus = (
  status: SportsApiStatus,
): MatchStatus => {
  switch (status) {
    case "NS":
      return MatchStatus.SCHEDULED;
    case "1H":
      return MatchStatus.FIRST_HALF;
    case "HT":
      return MatchStatus.HALFTIME;
    case "2H":
      return MatchStatus.SECOND_HALF;
    default:
      return MatchStatus.FINISHED;
  }
};

type Fixture = {
  id: number;
  date: string;
  status: { short: SportsApiStatus; elapsed: number | null };
};

type SportsApiResponse = {
  response: {
    fixture: Fixture;
    league: {
      id: number;
      name: string;
      logo: string;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
      };
      away: {
        id: number;
        name: string;
        logo: string;
      };
    };
    goals: {
      home: number | null;
      away: number | null;
    };
  }[];
};

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
  206, // Turkish Cup
];

const baseUrl = "https://api-football-v1.p.rapidapi.com/v3";
const headers = {
  "x-rapidapi-key": process.env.SPORTS_API_KEY,
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

const getGames = async (date: DateTime) => {
  const { data } = await axios.get<SportsApiResponse>(`${baseUrl}/fixtures`, {
    params: {
      date: date.toISODate(),
      timezone: "Europe/Budapest",
    },
    headers,
  });

  console.log(data);

  return data.response.filter((match) => leagues.includes(match.league.id));
};

const getLiveGames = async () => {
  const { data } = await axios.get<SportsApiResponse>(`${baseUrl}/fixtures`, {
    params: {
      timezone: "Europe/Budapest",
      live: leagues.join("-"),
    },
    headers,
  });

  console.log(data);

  return data.response.filter((match) => leagues.includes(match.league.id));
};

export const SportsApi = {
  getGames,
  getLiveGames,
};
