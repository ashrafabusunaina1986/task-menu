
// types/team/team.ts

export type TeamStatus = "active" | "archived" | "suspended";

export type TeamVisibility = "private" | "public";

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  project_id: string;
  status: TeamStatus;
  visibility: TeamVisibility;
  created_at: string;
  updated_at: string;
}

export interface TeamCreate {
  name: string;
  description?: string | null;
  project_id: string;
  visibility?: TeamVisibility;
}

export interface TeamUpdate {
  name?: string;
  description?: string | null;
  status?: TeamStatus;
  visibility?: TeamVisibility;
}

export interface TeamRead {
  id?: string;
  team_id?: string;
  owner_id?: string;
  project_id?: string;
  name?: string;
  status?: TeamStatus;
  visibility?: TeamVisibility;
}

export interface TeamsRead {
  owner_id?: string;
  project_id?: string;
  name?: string;
  status?: TeamStatus;
  visibility?: TeamVisibility;
}

export interface TeamResponse extends Team { }

export interface TeamsResponse {
  teams: Team[];
  total: number;
}
