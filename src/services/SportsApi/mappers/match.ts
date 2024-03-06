import type { Match } from "@prisma/client";

import type { ApiMatch } from "./../types";
import { mapMatchStatus } from "./matchStatus";

export const mapMatch = (match: ApiMatch): Match => ({
  id: match.fixture.id,
  startDate: new Date(match.fixture.date),
  homeScore: match.goals.home ?? 0,
  awayScore: match.goals.away ?? 0,
  homeTeamId: match.teams.home.id,
  awayTeamId: match.teams.away.id,
  competitionId: match.league.id,
  elapsed: match.fixture.status.elapsed ?? 0,
  status: mapMatchStatus(match.fixture.status.short),
});
