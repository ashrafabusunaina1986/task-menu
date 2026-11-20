// types/team/invitations.ts


export type TeamInvitationRole = "member" | "admin";

export type TeamInvitationStatus =
    | "pending"
    | "accepted"
    | "rejected"
    | "expired"
    | "cancelled";

export interface TeamInvitationBase {
    team_id: string;
    invitee_email: string;
    role?: TeamInvitationRole;
}

export interface TeamInvitationCreate extends TeamInvitationBase { }

export interface TeamInvitationRead {
    id?: string;
    team_id?: string;
    inviter_id?: string;
    invitee_email?: string;
    role?: TeamInvitationRole;
    status?: TeamInvitationStatus;
}

export interface TeamInvitationsRead {
    team_id?: string;
    inviter_id?: string;
    invitee_email?: string;
    role?: TeamInvitationRole;
    status?: TeamInvitationStatus;
}

export interface TeamInvitationUpdate {
    invitee_email?: string | null;
    role?: TeamInvitationRole | null;
}

export interface TeamInvitation extends TeamInvitationBase {
    id: string;
    inviter_id: string;
    status: TeamInvitationStatus;
    expires_at: string;
    responded_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface TeamInvitationResponse extends TeamInvitation { }

export interface TeamInvitationsResponse {
    invitations: TeamInvitationResponse[];
    total: number;
}
