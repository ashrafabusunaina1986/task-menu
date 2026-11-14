// frontend/schemas/project.ts

import { check_project_name } from '@/lib/project/project';
import { z } from 'zod';

const enumConfig = {
    status: ["planned", "in_progress", "on_hold", "completed", "cancelled"] as const,
    priority: ["low", "medium", "high"] as const
};

const rawNameValidator = z.string()
    .min(3, { message: "Project container identifier name must be at least 3 characters in length." })
    .max(150, { message: "Project container identifier name cannot exceed 150 characters." })
    .refine((val) => val.trim().length > 0, { message: "Project name cannot consist of blank whitespace entries." });

const sharedFields = {
    description: z.string()
        .max(2000, { message: "Metadata operational description parameters cannot exceed 2000 characters." })
        .nullable()
        .optional(),

    status: z.enum(enumConfig.status, {
        message: "Operational Status must conform strictly to system pipeline enumerable types."
    }).default("planned"),

    priority: z.enum(enumConfig.priority, {
        message: "Risk Priority parameter must match strict low, medium, or high profiles."
    }).default("medium"),

    start_date: z.string()
        .nullable()
        .optional()
        .refine((val) => !val || val.trim().length === 0 || !isNaN(Date.parse(val)), { message: "Initialization date must match a standard cryptographic timestamp sequence." }),

    due_date: z.string()
        .nullable()
        .optional()
        .refine((val) => !val || val.trim().length === 0 || !isNaN(Date.parse(val)), { message: "Target delivery deadline must match a standard cryptographic timestamp sequence." })
};

/**
 * 🚀 1. CREATE VALIDATION CONTRACT SCHEMA
 * Enforces strict entry validation constraints along with real-time database unique name checks.
 */
export const projectCreateSchema = z.object({
    name: rawNameValidator
        .refine(async (val) => {
            if (!val || val.trim().length < 3) return false;
            try {
                const response = await check_project_name(val.trim())
                if (!response.success) return false;


                // If nameExists is true, return false to block the submission loop and trigger the error message
                return response.data
            } catch {
                return false; // Fallback smoothly to backend exception layers on connection lags
            }
        }, { message: "This project name already exists in the database. Identifiers must be entirely unique." }),
    ...sharedFields
}).refine((data) => {
    const hasStart = data.start_date && data.start_date.trim().length > 0;
    const hasDue = data.due_date && data.due_date.trim().length > 0;

    // 🔒 MUTUAL DEPENDENCY SECURITY GATE: If one date is provided, the other MUST be provided as well
    if ((hasStart && !hasDue) || (!hasStart && hasDue)) {
        return false; // Fails validation instantly if there is a missing pair symmetry
    }

    // 🛡️ Cross-Timeline Validation Gate: Intercept chronologically invalid time distributions live
    if (hasStart && hasDue) {
        const startTimestamp = new Date(data.start_date!).getTime();
        const dueTimestamp = new Date(data.due_date!).getTime();
        return dueTimestamp >= startTimestamp;
    }

    // Fallback pass authorization if both fields are left completely blank (Optional baseline state)
    return true;
}, {
    // Dynamic adaptive failure message mapping to inform the operator about the required dual entry matrix
    message: "Chronological Co-dependency Exception: Both Initialization Date and Target Delivery Deadline must be provided together, and the due date cannot be earlier than the start date.",
    path: ["due_date"] // Attaches the validation pulse alarm directly over the target HTML due date component frame
});


/**
 * 🔧 2. UPDATE VALIDATION CONTRACT SCHEMA
 * Hardened patch mutation validator contract to securely intercept duplicates during edits.
 */
export const projectUpdateSchema = z.object({
    name: rawNameValidator,
    ...sharedFields
}).partial().refine((data) => {
    if (data.start_date && data.due_date) {
        const startTimestamp = new Date(data.start_date).getTime();
        const dueTimestamp = new Date(data.due_date).getTime();
        return dueTimestamp >= startTimestamp;
    }
    return true;
}, {
    message: "Chronological Exception: Target delivery deadline (Due Date) cannot be staged earlier than the initialization start date.",
    path: ["due_date"]
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
