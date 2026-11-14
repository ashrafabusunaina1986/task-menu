// frontend/schemas/task.ts

import { z } from 'zod';
import { check_task_title } from '@/lib/task/task'; // Injected: Importing your clean, on-device AI custom helper function

const enumConfig = {
    status: ["todo", "in_progress", "done"] as const,
    priority: ["low", "medium", "high"] as const
};

/**
 * ✅ DRY REFACTOR: Isolated reusable validator blueprint for the task title attribute.
 */
const rawTitleValidator = z.string()
    .min(3, { message: "Task operation title must be at least 3 characters in length." })
    .max(150, { message: "Task operation title cannot exceed 150 characters." })
    .refine((val) => val.trim().length > 0, { message: "Task title cannot consist of empty whitespace entries." });

/**
 * Shared blueprint layout schema fields defining generic task container attributes.
 */
const sharedFields = {
    description: z.string()
        .max(1000, { message: "Task functional context and description cannot exceed 1000 characters." })
        .nullable()
        .optional(),

    status: z.enum(enumConfig.status, {
        message: "Operational Status must conform strictly to system task pipeline enumerable types."
    }).default("todo"),

    priority: z.enum(enumConfig.priority, {
        message: "Severity Priority rating parameter must match low, medium, or high profiles exclusively."
    }).default("low"),

    start_date: z.string()
        .nullable()
        .optional()
        .refine((val) => !val || val.trim.length === 0 || !isNaN(Date.parse(val)), { message: "Task activation start parameter must match a standard timestamp sequence." }),

    due_date: z.string()
        .nullable()
        .optional()
        .refine((val) => !val || val.trim.length === 0 || !isNaN(Date.parse(val)), { message: "Task expiration deadline must match a standard timestamp sequence." }),

    user_id: z.string()
        .min(1, { message: "Target executive resource operator user identification token is required." }),

    project_id: z.string()
        .min(1, { message: "Parent tracking project container reference index ID code is required." })
};

/**
 * 🚀 1. TASK CREATE VALIDATION CONTRACT SCHEMA
 * Governs structural entry integrity barriers when provisioning new atomic task container nodes.
 * ✅ ASHRAF'S CLEAN ARCHITECTURE PATTERN: Consumes a clean standalone helper function loop to decouple code layers.
 */
export const taskCreateSchema = z.object({
    title: rawTitleValidator
        .refine(async (val) => {
            if (!val || val.trim().length < 3) return false;

            // Invoking your elegant, short abstract helper method beautifully
            const response = await check_task_title(val.trim());
            if (!response || !response.success) return false;

            // Returns the backend boolean result data directly to fire the Zod unique validation error if needed
            return !response.data;
        }, { message: "This task title already exists within the system database registries. Interface tokens must be unique." }),
    ...sharedFields
}).refine((data) => {
    const hasStart = data.start_date && data.start_date.trim().length > 0;
    const hasDue = data.due_date && data.due_date.trim().length > 0;

    // 🔒 TASK MUTUAL DEPENDENCY GATE: If one task timeline date is provided, the other MUST be provided as well
    if ((hasStart && !hasDue) || (!hasStart && hasDue)) {
        return false; // Fails validation instantly if there is a missing pair symmetry in task parameters
    }

    // 🛡️ Cross-Timeline Validation Gate: Prevent chronologically invalid task timelines inside the client viewport
    if (hasStart && hasDue) {
        const taskStart = new Date(data.start_date!).getTime();
        const taskDue = new Date(data.due_date!).getTime();
        return taskDue >= taskStart;
    }

    // Fallback pass authorization if both fields are left completely blank (Optional baseline state)
    return true;
}, {
    // Dynamic adaptive failure message mapping to inform the operator about the required dual task entry matrix
    message: "Chronological Co-dependency Exception: Both Task Activation Start and Task Expiration Deadline must be provided together, and the due date cannot be earlier than the start date.",
    path: ["due_date"] // Attaches the validation pulse alarm directly over the target HTML due date component frame
});

/**
 * 🔧 2. TASK UPDATE VALIDATION CONTRACT SCHEMA
 * Implements a hyper-flexible partial wrapper contract to run secure, segmented mutation patches on existing task registries.
 * Bypasses hardcoded async check blocks here to hand over advanced state-aware matching directly to the TaskForm viewport layer.
 */
export const taskUpdateSchema = z.object({
    title: rawTitleValidator,
    ...sharedFields
}).partial().refine((data) => {
    if (data.start_date && data.due_date) {
        const taskStart = new Date(data.start_date).getTime();
        const taskDue = new Date(data.due_date).getTime();
        return taskDue >= taskStart;
    }
    return true;
}, {
    message: "Chronological Exception: Task delivery deadline (Due Date) cannot be staged earlier than its activation start date.",
    path: ["due_date"]
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
