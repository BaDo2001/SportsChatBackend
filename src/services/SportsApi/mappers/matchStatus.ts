import { MatchStatus } from "@prisma/client";

import type { SportsApiStatus } from "../types";

export const mapMatchStatus = (status: SportsApiStatus): MatchStatus => {
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
