// schemas/register.ts

import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().refine((value) => value.trim().split(/\s+/).length >= 2,
        {
            message: "Name must contain at least two words."
        }),
    email: z.email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    })
})