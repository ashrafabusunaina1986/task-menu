

// lib/team/invitations/client.ts

import {
    TeamInvitation,
    TeamInvitationCreate,
    TeamInvitationRead,
    TeamInvitationsRead,
    TeamInvitationUpdate,
    TeamInvitationResponse,
    TeamInvitationsResponse,
} from "@/types/team/invitations";

import { clientFetch } from "../../client_api";

// ============================================
// GET ALL INVITATIONS
// ============================================

export function getInvitations(
    data: TeamInvitationsRead = {}
): Promise<TeamInvitationsResponse> {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    });

    const query = params.toString();

    return clientFetch<TeamInvitationsResponse>(
        `/invitations/get_invitations${query ? `?${query}` : ""}`
    );
}

// ============================================
// GET INVITATION
// ============================================

export function getInvitation(
    data: TeamInvitationRead
): Promise<TeamInvitationResponse> {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    });

    return clientFetch<TeamInvitationResponse>(
        `/invitations/get_invitation?${params.toString()}`
    );
}

// ============================================
// GET INVITATION BY ID
// ============================================

export function getInvitationById(
    invitationId: string
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/get_invitation_by_id/${encodeURIComponent(invitationId)}`
    );
}

// ============================================
// GET PENDING INVITATION
// ============================================

export function getPendingInvitation(
    teamId: string,
    inviteeEmail: string
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/get_pending_invitation?team_id=${encodeURIComponent(teamId)}&invitee_email=${encodeURIComponent(inviteeEmail)}`
    );
}

// ============================================
// GET INVITATIONS BY TEAM
// ============================================

export function getInvitationsByTeam(
    teamId: string
): Promise<TeamInvitationsResponse> {
    return clientFetch<TeamInvitationsResponse>(
        `/invitations/get_invitations_by_team/${encodeURIComponent(teamId)}`
    );
}

// ============================================
// GET INVITATIONS BY EMAIL
// ============================================

export function getInvitationsByEmail(
    inviteeEmail: string
): Promise<TeamInvitationsResponse> {
    return clientFetch<TeamInvitationsResponse>(
        `/invitations/get_invitations_by_email?invitee_email=${encodeURIComponent(inviteeEmail)}`
    );
}

// ============================================
// GET INVITATION BY TEAM AND EMAIL
// ============================================

export function getInvitationByTeamAndEmail(
    teamId: string,
    inviteeEmail: string
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/get_invitation_by_team_and_email?team_id=${encodeURIComponent(teamId)}&invitee_email=${encodeURIComponent(inviteeEmail)}`
    );
}

// ============================================
// CREATE INVITATION
// ============================================

export function createInvitation(
    data: TeamInvitationCreate
): Promise<TeamInvitation> {
    return clientFetch<TeamInvitation>(
        `/invitations/create`,
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

// ============================================
// UPDATE INVITATION
// ============================================

export function updateInvitation(
    invitationId: string,
    data: TeamInvitationUpdate
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/update/${encodeURIComponent(invitationId)}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
}

// ============================================
// DELETE INVITATION
// ============================================

export function deleteInvitation(
    invitationId: string
): Promise<void> {
    return clientFetch<void>(
        `/invitations/delete/${encodeURIComponent(invitationId)}`,
        {
            method: "DELETE",
        }
    );
}

// ============================================
// DELETE INVITATIONS BY TEAM
// ============================================

export function deleteInvitations(
    teamId: string
): Promise<number> {
    return clientFetch<number>(
        `/invitations/delete_invitations/${encodeURIComponent(teamId)}`,
        {
            method: "DELETE",
        }
    );
}

// ============================================
// ACCEPT INVITATION
// ============================================

export function acceptInvitation(
    invitationId: string
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/accept/${encodeURIComponent(invitationId)}`,
        {
            method: "PATCH",
        }
    );
}

// ============================================
// REJECT INVITATION
// ============================================

export function rejectInvitation(
    invitationId: string
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/reject/${encodeURIComponent(invitationId)}`,
        {
            method: "PATCH",
        }
    );
}

// ============================================
// CANCEL INVITATION
// ============================================

export function cancelInvitation(
    invitationId: string
): Promise<TeamInvitationResponse> {
    return clientFetch<TeamInvitationResponse>(
        `/invitations/cancel/${encodeURIComponent(invitationId)}`,
        {
            method: "PATCH",
        }
    );
}
