import type { Team } from "@prisma/client";

import type { ApiTeam } from "../types";

export const mapTeam = (team: ApiTeam): Team => ({
  id: team.id,
  name: team.name,
  logo: team.logo,
});
