export type SportsApiStatus = "NS" | "1H" | "HT" | "2H" | "FT";

type Fixture = {
  id: number;
  date: string;
  status: { short: SportsApiStatus; elapsed: number | null };
};

type BaseEvent = {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: ApiTeam;
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
};

type GoalEvent = BaseEvent & {
  type: "Goal";
  detail: "Normal Goal" | "Own Goal" | "Penalty";
};

type CardEvent = BaseEvent & {
  type: "Card";
  detail: "Yellow Card" | "Red Card";
};

type SubstitutionEvent = BaseEvent & {
  type: "subst";
};

type VarEvent = BaseEvent & {
  type: "Var";
  detail: string;
};

export type ApiMatchEvent =
  | GoalEvent
  | CardEvent
  | SubstitutionEvent
  | VarEvent;

export type ApiCompetition = {
  id: number;
  name: string;
  logo: string;
};

export type ApiTeam = {
  id: number;
  name: string;
  logo: string;
};

export type ApiMatch = {
  fixture: Fixture;
  league: ApiCompetition;
  teams: {
    home: ApiTeam;
    away: ApiTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

export type ApiGamesResponse = {
  response: ApiMatch[];
};

type ApiLiveResponseBody = ApiMatch & {
  events: ApiMatchEvent[];
};

export type ApiLiveResponse = {
  response: ApiLiveResponseBody[];
};

export type ApiFixtureEventsResponse = {
  response: ApiMatchEvent[];
};
