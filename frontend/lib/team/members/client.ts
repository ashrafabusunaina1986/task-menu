// lib/team/members/client.ts

import { clientFetch } from "../../client_api";

import {
    TeamMemberCreate,
    TeamMemberRead,
    TeamMemberResponse,
    TeamMembersRead,
    TeamMembersResponse,
    TeamMemberUpdate,
} from "@/types/team/members";


// ===============================================
// QUERY PARAMETERS
// ===============================================

function buildQuery(data: object): string {

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {

        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }

    });

    const query = params.toString();

    return query ? `?${query}` : "";
}


// ===============================================
// CREATE TEAM MEMBER
// ===============================================

export function createTeamMember(
    data: TeamMemberCreate
) {

    return clientFetch<TeamMemberResponse>(
        "/team-members/create",
        {
            method: "POST",
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

    return clientFetch<TeamMembersResponse>(
        `/team-members/get-members${buildQuery(data)}`
    );
}


// ===============================================
// GET TEAM MEMBERS
// ===============================================

export function getTeamMembers(
    teamId: string
) {

    return clientFetch<TeamMembersResponse>(
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

    return clientFetch<TeamMembersResponse>(
        `/team-members/get-members-by-user-and-team?user_id=${encodeURIComponent(userId)}&team_id=${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// GET MEMBER
// ===============================================

export function getMember(
    data: TeamMemberRead
) {

    return clientFetch<TeamMemberResponse | null>(
        `/team-members/get-member${buildQuery(data)}`
    );
}


// ===============================================
// GET MEMBER BY USER
// ===============================================

export function getMemberByUser(
    userId: string
) {

    return clientFetch<TeamMemberResponse | null>(
        `/team-members/get-member-by-user?user_id=${encodeURIComponent(userId)}`
    );
}


// ===============================================
// GET MEMBER BY TEAM
// ===============================================

export function getMemberByTeam(
    teamId: string
) {

    return clientFetch<TeamMemberResponse | null>(
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

    return clientFetch<TeamMemberResponse | null>(
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

    return clientFetch<TeamMemberResponse | null>(
        `/team-members/update/${encodeURIComponent(membershipId)}`,
        {
            method: "PUT",
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

    return clientFetch<number>(
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

    return clientFetch<boolean>(
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

    return clientFetch<TeamMemberResponse>(
        `/team-members/reactivate?user_id=${encodeURIComponent(userId)}&team_id=${encodeURIComponent(teamId)}`,
        {
            method: "PUT"
        }
    );
}
