// types/block.ts
export interface BlockStatus {
    success: boolean
    data: {
        blocked: boolean
        reason?: string
        blocked_until?: string
    }
}