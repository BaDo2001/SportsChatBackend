import type { Competition } from "@prisma/client";

import type { ApiCompetition } from "../types";

export const mapCompetition = (competition: ApiCompetition): Competition => ({
  id: competition.id,
  name: competition.name,
  logo: competition.logo,
});
