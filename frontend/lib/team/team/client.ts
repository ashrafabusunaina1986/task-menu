
// lib/team/team/client.ts

import {
    Team,
    TeamCreate,
    TeamRead,
    TeamStatus,
    TeamUpdate,
} from "@/types/team/team";

import { clientFetch } from "../../client_api";

// ============================================
// GET ALL TEAMS
// ============================================

export function getTeams(): Promise<{ success: boolean; data: Team[] }> {
    return clientFetch<{
        success: boolean;
        data: Team[];
    }>(
        `/teams/get-teams`
    );
}

// ============================================
// GET TEAMS BY OWNER
// ============================================

export function getTeamsByOwner(ownerId: string): Promise<{ success: boolean; data: Team[] }> {
    return clientFetch<{
        success: boolean;
        data: Team[];
    }>(
        `/teams/get-teams-by-owner?owner_id=${encodeURIComponent(ownerId)}`
    );
}

// ============================================
// GET TEAMS BY STATUS
// ============================================

export function getTeamsByStatus(teamStatus: TeamStatus): Promise<{ success: boolean; data: Team[] }> {
    return clientFetch<{
        success: boolean;
        data: Team[];
    }>(
        `/teams/get-teams-by-status?status=${encodeURIComponent(teamStatus)}`
    );
}

// ============================================
// GET TEAM
// ============================================

export function getTeam(data: TeamRead): Promise<{ success: boolean; data: Team | null }> {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    });

    return clientFetch<{
        success: boolean;
        data: Team | null;
    }>(
        `/teams/get-team?${params.toString()}`
    );
}

// ============================================
// GET TEAM BY ID
// ============================================

export function getTeamById(teamId: string): Promise<{ success: boolean; data: Team | null }> {
    return clientFetch<{
        success: boolean;
        data: Team | null;
    }>(
        `/teams/get-team-by-id?team_id=${encodeURIComponent(teamId)}`
    );
}

// ============================================
// GET TEAM BY NAME
// ============================================

export function getTeamByName(name: string): Promise<{ success: boolean; data: Team | null }> {
    return clientFetch<{
        success: boolean;
        data: Team | null;
    }>(
        `/teams/get-team-by-name?name=${encodeURIComponent(name)}`
    );
}

// ============================================
// GET TEAM BY PROJECT
// ============================================

export function getTeamByProject(projectId: string): Promise<{ success: boolean; data: Team | null }> {
    return clientFetch<{
        success: boolean;
        data: Team | null;
    }>(
        `/teams/get-team-by-project?project_id=${encodeURIComponent(projectId)}`
    );
}

// ============================================
// CREATE TEAM
// ============================================

export function createTeam(data: TeamCreate): Promise<Team> {
    return clientFetch<Team>(
        `/teams/create`,
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

// ============================================
// UPDATE TEAM
// ============================================

export function updateTeam(
    teamId: string,
    data: TeamUpdate
): Promise<boolean> {
    return clientFetch<boolean>(
        `/teams/update?team_id=${encodeURIComponent(teamId)}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
}

// ============================================
// DELETE TEAM
// ============================================

export function deleteTeam(teamId: string): Promise<boolean> {
    return clientFetch<boolean>(
        `/teams/delete?team_id=${encodeURIComponent(teamId)}`,
        {
            method: "DELETE",
        }
    );
}
