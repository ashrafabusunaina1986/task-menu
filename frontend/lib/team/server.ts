
// lib/team/server.ts

import { auth } from "@/auth";
import { Team, TeamRead, TeamStatus } from "@/types/team/team";

const SERVER_API = process.env.API_URL_SERVER;

if (!SERVER_API) {
    throw new Error("API_URL_SERVER is not defined");
}

// ============================================
// GET TEAM
// ============================================

export async function getTeam(
    data: TeamRead
): Promise<Team | null> {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error("Not authenticated");
    }

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    });

    const res = await fetch(
        `${SERVER_API}/teams/get-team?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        const message = await res.text();

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    return res.json() as Promise<Team | null>;
}

// ============================================
// GET TEAM BY ID
// ============================================

export async function getTeamById(
    teamId: string
): Promise<Team | null> {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(
        `${SERVER_API}/teams/get-team-by-id?team_id=${encodeURIComponent(teamId)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        const message = await res.text();

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    return res.json() as Promise<Team | null>;
}

// ============================================
// GET TEAM BY PROJECT
// ============================================

export async function getTeamByProject(
    projectId: string
): Promise<Team | null> {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(
        `${SERVER_API}/teams/get-team-by-project?project_id=${encodeURIComponent(projectId)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        const message = await res.text();

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    return res.json() as Promise<Team | null>;
}


// ============================================
// GET ALL TEAMS
// ============================================

export async function getTeams(): Promise<Team[]> {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(
        `${SERVER_API}/teams/get-teams`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const message = await res.text();

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    return res.json() as Promise<Team[]>;
}

// ============================================
// GET TEAMS BY OWNER
// ============================================

export async function getTeamsByOwner(
    ownerId: string
): Promise<Team[]> {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(
        `${SERVER_API}/teams/get-teams-by-owner?owner_id=${encodeURIComponent(ownerId)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const message = await res.text();

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    return res.json() as Promise<Team[]>;
}

// ============================================
// GET TEAMS BY STATUS
// ============================================

export async function getTeamsByStatus(
    teamStatus: TeamStatus
): Promise<Team[]> {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(
        `${SERVER_API}/teams/get-teams-by-status?status=${encodeURIComponent(teamStatus)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const message = await res.text();

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    return res.json() as Promise<Team[]>;
}
