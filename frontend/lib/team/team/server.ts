
// lib/team/team/server.ts

import { auth } from "@/auth";

import {
    TeamCreate,
    TeamRead,
    TeamResponse,
    TeamsResponse,
    TeamStatus,
    TeamUpdate,
} from "@/types/team/team";


const SERVER_API = process.env.API_URL_SERVER;


if (!SERVER_API) {
    throw new Error(
        "API_URL_SERVER is not defined"
    );
}


// ===============================================
// INTERNAL FETCH
// ===============================================

async function serverFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {

    const session = await auth();


    const res = await fetch(
        `${SERVER_API}${path}`,
        {
            ...options,

            headers: {
                ...(options.headers ?? {}),
                Authorization:
                    `Bearer ${session?.accessToken}`
            },

            cache: "no-store"
        }
    );


    if (!res.ok) {

        const message = await res.text();

        throw new Error(
            message ||
            `Request failed with status ${res.status}`
        );
    }


    return res.json() as Promise<T>;
}


// ===============================================
// GET TEAM
// ===============================================

export function getTeam(
    data: TeamRead
) {

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {

        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }

    });


    return serverFetch<TeamResponse>(
        `/teams/get-team?${params.toString()}`
    );
}


// ===============================================
// GET TEAM BY ID
// ===============================================

export function getTeamById(
    teamId: string
) {

    return serverFetch<TeamResponse>(
        `/teams/get-team-by-id?team_id=${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// GET TEAM BY NAME
// ===============================================

export function getTeamByName(
    name: string
) {

    return serverFetch<TeamResponse>(
        `/teams/get-team-by-name?name=${encodeURIComponent(name)}`
    );
}


// ===============================================
// GET TEAM BY PROJECT
// ===============================================

export function getTeamByProject(
    projectId: string
) {

    return serverFetch<TeamResponse>(
        `/teams/get-team-by-project?project_id=${encodeURIComponent(projectId)}`
    );
}


// ===============================================
// GET ALL TEAMS
// ===============================================

export function getTeams() {

    return serverFetch<TeamsResponse>(
        "/teams/get-teams"
    );
}


// ===============================================
// GET TEAMS BY OWNER
// ===============================================

export function getTeamsByOwner(
    ownerId: string
) {

    return serverFetch<TeamsResponse>(
        `/teams/get-teams-by-owner?owner_id=${encodeURIComponent(ownerId)}`
    );
}


// ===============================================
// GET TEAMS BY STATUS
// ===============================================

export function getTeamsByStatus(
    teamStatus: TeamStatus
) {

    return serverFetch<TeamsResponse>(
        `/teams/get-teams-by-status?status=${encodeURIComponent(teamStatus)}`
    );
}


// ===============================================
// CREATE TEAM
// ===============================================

export function createTeam(
    data: TeamCreate
) {

    return serverFetch<TeamResponse>(
        "/teams/create",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
}


// ===============================================
// UPDATE TEAM
// ===============================================

export function updateTeam(
    teamId: string,
    data: TeamUpdate
) {

    return serverFetch<TeamResponse>(
        `/teams/update?team_id=${encodeURIComponent(teamId)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
}


// ===============================================
// DELETE TEAM
// ===============================================

export function deleteTeam(
    teamId: string
) {

    return serverFetch<boolean>(
        `/teams/delete?team_id=${encodeURIComponent(teamId)}`,
        {
            method: "DELETE"
        }
    );
}
