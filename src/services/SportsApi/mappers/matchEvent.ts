import type MatchEvent from "@/types/MatchEvent";
import { MatchEventType } from "@/types/MatchEvent";

import type { ApiMatchEvent } from "../types";

export const mapMatchEvents = (
  events: ApiMatchEvent[],
  matchId: number,
): MatchEvent[] =>
  events.map((event, index) => ({
    id: `event-${matchId}-${index}`,
    time: event.time,
    team: {
      id: event.team.id,
      name: event.team.name,
      logo: event.team.logo,
    },
    player: {
      id: event.player.id,
      name: event.player.name,
    },
    assist:
      event.assist.id && event.assist.name
        ? {
            id: event.assist.id,
            name: event.assist.name,
          }
        : null,
    type: mapMatchEventType(event),
    detail: event.type === "Var" ? event.detail : null,
  }));

export const mapMatchEventType = (event: ApiMatchEvent): MatchEventType => {
  switch (event.type) {
    case "Goal":
      return event.detail === "Own Goal"
        ? MatchEventType.OwnGoal
        : event.detail === "Penalty"
          ? MatchEventType.Penalty
          : MatchEventType.Goal;
    case "Card":
      return event.detail === "Yellow Card"
        ? MatchEventType.YellowCard
        : MatchEventType.RedCard;
    case "subst":
      return MatchEventType.Substitution;
    default:
      return MatchEventType.Var;
  }
};
