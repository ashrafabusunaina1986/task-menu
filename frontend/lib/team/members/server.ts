// lib/team/members/server.ts

import { auth } from "@/auth";

import {
    TeamMemberCreate,
    TeamMemberRead,
    TeamMemberResponse,
    TeamMembersRead,
    TeamMembersResponse,
    TeamMemberUpdate,
} from "@/types/team/members";


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
// QUERY PARAMETERS
// ===============================================

function buildQuery(
    data: object
): string {

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {

        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }

    });

    return params.toString();
}


// ===============================================
// CREATE TEAM MEMBER
// ===============================================

export function createTeamMember(
    data: TeamMemberCreate
) {

    return serverFetch<TeamMemberResponse>(
        "/team-members/create",
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
// GET ALL MEMBERS
// ===============================================

export function getMembers(
    data: TeamMembersRead = {}
) {

    const query = buildQuery(data);

    return serverFetch<TeamMembersResponse>(
        `/team-members/get-members?${query}`
    );
}


// ===============================================
// GET TEAM MEMBERS
// ===============================================

export function getTeamMembers(
    teamId: string
) {

    return serverFetch<TeamMembersResponse>(
        `/team-members/get-team-members?team_id=${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// GET MEMBERS BY USER AND TEAM
// ===============================================

export function getMembersByUserAndTeam(
    userId: string,
    teamId: string
) {

    return serverFetch<TeamMembersResponse>(
        `/team-members/get-members-by-user-and-team?user_id=${encodeURIComponent(userId)}&team_id=${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// GET MEMBER
// ===============================================

export function getMember(
    data: TeamMemberRead
) {

    const query = buildQuery(data);

    return serverFetch<TeamMemberResponse | null>(
        `/team-members/get-member?${query}`
    );
}


// ===============================================
// GET MEMBER BY USER
// ===============================================

export function getMemberByUser(
    userId: string
) {

    return serverFetch<TeamMemberResponse | null>(
        `/team-members/get-member-by-user?user_id=${encodeURIComponent(userId)}`
    );
}


// ===============================================
// GET MEMBER BY TEAM
// ===============================================

export function getMemberByTeam(
    teamId: string
) {

    return serverFetch<TeamMemberResponse | null>(
        `/team-members/get-member-by-team?team_id=${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// GET MEMBER BY TEAM AND USER
// ===============================================

export function getMemberByTeamAndUser(
    userId: string,
    teamId: string
) {

    return serverFetch<TeamMemberResponse | null>(
        `/team-members/get-member-by-team-and-user?user_id=${encodeURIComponent(userId)}&team_id=${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// UPDATE TEAM MEMBER
// ===============================================

export function updateTeamMember(
    membershipId: string,
    data: TeamMemberUpdate
) {

    return serverFetch<TeamMemberResponse | null>(
        `/team-members/update/${encodeURIComponent(membershipId)}`,
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
// DELETE ALL TEAM MEMBERS
// ===============================================

export function deleteTeamMembers(
    teamId: string
) {

    return serverFetch<number>(
        `/team-members/delete-members/${encodeURIComponent(teamId)}`,
        {
            method: "DELETE"
        }
    );
}


// ===============================================
// DELETE TEAM MEMBER
// ===============================================

export function deleteTeamMember(
    membershipId: string
) {

    return serverFetch<boolean>(
        `/team-members/delete/${encodeURIComponent(membershipId)}`,
        {
            method: "DELETE"
        }
    );
}


// ===============================================
// REACTIVATE TEAM MEMBER
// ===============================================

export function reactivateTeamMember(
    userId: string,
    teamId: string
) {

    return serverFetch<TeamMemberResponse>(
        `/team-members/reactivate?user_id=${encodeURIComponent(userId)}&team_id=${encodeURIComponent(teamId)}`,
        {
            method: "PUT"
        }
    );
}
