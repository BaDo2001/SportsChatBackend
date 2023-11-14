import { DateTime } from "luxon";

import type Match from "@/types/Match";
import { MatchStatus } from "@/types/Match";

import { competitions } from "./competition";
import { getRandomPairings } from "./teams";

export const getGameStatus = (date: DateTime): [MatchStatus, DateTime] => {
  const now = DateTime.now();

  if (now < date) {
    return [MatchStatus.SCHEDULED, date];
  }

  if (now < date.plus({ minutes: 47 })) {
    return [MatchStatus.FIRST_HALF, date];
  }

  if (now < date.plus({ minutes: 62 })) {
    return [MatchStatus.HALFTIME, date];
  }

  if (now < date.plus({ minutes: 112 })) {
    return [MatchStatus.SECOND_HALF, date.plus({ minutes: 62 })];
  }

  return [MatchStatus.FINISHED, date.plus({ minutes: 62 })];
};

export const createGames = (date: DateTime) => {
  const games: Match[] = [];

  const dateUtc = date.toUTC();

  for (const competition of competitions) {
    const pairings = getRandomPairings(competition.id);

    for (const pairing of pairings) {
      const matchDate = dateUtc.plus({
        hour: Math.floor(Math.random() * 24),
      });

      const [status, periodStart] = getGameStatus(matchDate);

      games.push({
        id: `sr:match:${matchDate.toISODate()}:${pairing[0].id}:${
          pairing[1].id
        }`,
        startDate: matchDate.toJSDate(),
        periodStart: periodStart.toJSDate(),
        status,
        competition,
        homeTeam: pairing[0],
        awayTeam: pairing[1],
        homeScore:
          status === MatchStatus.SCHEDULED ? 0 : Math.floor(Math.random() * 5),
        awayScore:
          status === MatchStatus.SCHEDULED ? 0 : Math.floor(Math.random() * 5),
      });
    }
  }

  return games.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};
