
// lib/team/invitations/server.ts


import { auth } from "@/auth";

import {
    TeamInvitationCreate,
    TeamInvitationRead,
    TeamInvitationResponse,
    TeamInvitationsRead,
    TeamInvitationsResponse,
    TeamInvitationUpdate,
} from "@/types/team/invitations";


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

    // Handle endpoints that return HTTP 204 without a response body.
    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}


// ===============================================
// GET INVITATIONS
// ===============================================

export function getInvitations(
    data: TeamInvitationsRead = {}
) {

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {

        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }

    });

    const query = params.toString();

    return serverFetch<TeamInvitationsResponse>(
        `/invitations/get_invitations${query ? `?${query}` : ""}`
    );
}


// ===============================================
// GET INVITATION
// ===============================================

export function getInvitation(
    data: TeamInvitationRead
) {

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {

        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }

    });

    const query = params.toString();

    return serverFetch<TeamInvitationResponse>(
        `/invitations/get_invitation${query ? `?${query}` : ""}`
    );
}


// ===============================================
// GET INVITATION BY ID
// ===============================================

export function getInvitationById(
    invitationId: string
) {

    return serverFetch<TeamInvitationResponse>(
        `/invitations/get_invitation_by_id/${encodeURIComponent(invitationId)}`
    );
}


// ===============================================
// GET PENDING INVITATION
// ===============================================

export function getPendingInvitation(
    teamId: string,
    inviteeEmail: string
) {

    const params = new URLSearchParams({
        team_id: teamId,
        invitee_email: inviteeEmail,
    });

    return serverFetch<TeamInvitationResponse>(
        `/invitations/get_pending_invitation?${params.toString()}`
    );
}


// ===============================================
// GET INVITATIONS BY TEAM
// ===============================================

export function getInvitationsByTeam(
    teamId: string
) {

    return serverFetch<TeamInvitationsResponse>(
        `/invitations/get_invitations_by_team/${encodeURIComponent(teamId)}`
    );
}


// ===============================================
// GET INVITATIONS BY EMAIL
// ===============================================

export function getInvitationsByEmail(
    inviteeEmail: string
) {

    return serverFetch<TeamInvitationsResponse>(
        `/invitations/get_invitations_by_email?invitee_email=${encodeURIComponent(inviteeEmail)}`
    );
}


// ===============================================
// GET INVITATION BY TEAM AND EMAIL
// ===============================================

export function getInvitationByTeamAndEmail(
    teamId: string,
    inviteeEmail: string
) {

    const params = new URLSearchParams({
        team_id: teamId,
        invitee_email: inviteeEmail,
    });

    return serverFetch<TeamInvitationResponse>(
        `/invitations/get_invitation_by_team_and_email?${params.toString()}`
    );
}


// ===============================================
// CREATE INVITATION
// ===============================================

export function createInvitation(
    data: TeamInvitationCreate
) {

    return serverFetch<TeamInvitationResponse>(
        "/invitations/create",
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
// UPDATE INVITATION
// ===============================================

export function updateInvitation(
    invitationId: string,
    data: TeamInvitationUpdate
) {

    return serverFetch<TeamInvitationResponse>(
        `/invitations/update/${encodeURIComponent(invitationId)}`,
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
// DELETE INVITATION
// ===============================================

export function deleteInvitation(
    invitationId: string
) {

    return serverFetch<void>(
        `/invitations/delete/${encodeURIComponent(invitationId)}`,
        {
            method: "DELETE"
        }
    );
}


// ===============================================
// DELETE TEAM INVITATIONS
// ===============================================

export function deleteInvitations(
    teamId: string
) {

    return serverFetch<number>(
        `/invitations/delete_invitations/${encodeURIComponent(teamId)}`,
        {
            method: "DELETE"
        }
    );
}


// ===============================================
// ACCEPT INVITATION
// ===============================================

export function acceptInvitation(
    invitationId: string
) {

    return serverFetch<TeamInvitationResponse>(
        `/invitations/accept/${encodeURIComponent(invitationId)}`,
        {
            method: "PATCH"
        }
    );
}


// ===============================================
// REJECT INVITATION
// ===============================================

export function rejectInvitation(
    invitationId: string
) {

    return serverFetch<TeamInvitationResponse>(
        `/invitations/reject/${encodeURIComponent(invitationId)}`,
        {
            method: "PATCH"
        }
    );
}


// ===============================================
// CANCEL INVITATION
// ===============================================

export function cancelInvitation(
    invitationId: string
) {

    return serverFetch<TeamInvitationResponse>(
        `/invitations/cancel/${encodeURIComponent(invitationId)}`,
        {
            method: "PATCH"
        }
    );
}
