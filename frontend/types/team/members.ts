
// types/team/members.ts

// ============================================
// ENUMS
// ============================================

export type TeamMemberRole = "owner" | "admin" | "member";

export type TeamMemberStatus = "active" | "pending" | "removed";

// ============================================
// TEAM MEMBER
// ============================================

export interface TeamMember {
    member_id: string;
    team_id: string;
    user_id: string;
    role: TeamMemberRole;
    status: TeamMemberStatus;
    joined_at?: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// CREATE
// ============================================

export interface TeamMemberCreate {
    team_id: string;
    user_id: string;
    role?: TeamMemberRole;
    status?: TeamMemberStatus;
    joined_at?: string | null;
}

// ============================================
// UPDATE
// ============================================

export interface TeamMemberUpdate {
    role?: TeamMemberRole | null;
    status?: TeamMemberStatus | null;
}

// ============================================
// READ
// ============================================

export interface TeamMemberRead {
    member_id?: string;
    team_id?: string;
    user_id?: string;
    role?: TeamMemberRole;
    status?: TeamMemberStatus;
}

export interface TeamMembersRead {
    team_id?: string;
    user_id?: string;
    role?: TeamMemberRole;
    status?: TeamMemberStatus;
}

// ============================================
// RESPONSE
// ============================================

export interface TeamMemberResponse extends TeamMember {}

export interface TeamMembersResponse {
    members: TeamMemberResponse[];
    total: number;
}
