import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'auth.validation.email' }),
    password: z.string().min(6, { message: 'auth.validation.passwordMin' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, { message: 'auth.validation.nameRequired' }),
    email: z.string().email({ message: 'auth.validation.email' }),
    password: z.string().min(6, { message: 'auth.validation.passwordMin' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'auth.validation.passwordMatch',
    path: ['password_confirmation'],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
