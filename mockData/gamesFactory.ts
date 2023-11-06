import { DateTime } from "luxon";

import type Match from "@/types/Match";
import { MatchStatus } from "@/types/Match";

import { competitions } from "./competition";
import { getRandomPairings } from "./teams";

const getGameStatus = (date: DateTime): MatchStatus => {
  const now = DateTime.now();

  if (now < date) {
    return MatchStatus.SCHEDULED;
  }

  if (now < date.plus({ minutes: 47 })) {
    return MatchStatus.IN_PLAY;
  }

  if (now < date.plus({ minutes: 62 })) {
    return MatchStatus.HALFTIME;
  }

  if (now < date.plus({ minutes: 112 })) {
    return MatchStatus.IN_PLAY;
  }

  return MatchStatus.FINISHED;
};

export const createGames = (date: DateTime) => {
  const games: Match[] = [];

  const dateUtc = date.toUTC();

  for (const competition of competitions) {
    const pairings = getRandomPairings(competition.id);

    for (const pairing of pairings) {
      const matchDate = dateUtc.set({
        hour: Math.floor(Math.random() * 24),
      });

      const status = getGameStatus(matchDate);

      games.push({
        id: `sr:match:${matchDate.toISODate()}:${pairing[0].id}:${
          pairing[1].id
        }`,
        startDate: matchDate.toJSDate(),
        periodStart: (DateTime.now().toUTC() > matchDate.plus({ minutes: 62 })
          ? matchDate.plus({ minutes: 62 })
          : matchDate
        ).toJSDate(),
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
