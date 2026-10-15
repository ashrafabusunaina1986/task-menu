// schemas/register.ts

import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().refine((value) => value.trim().split(/\s+/).length >= 1,
        {
            message: "Name must contain at least one words."
        }),
    email: z.email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    })
})