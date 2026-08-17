import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "staff"], {
    errorMap: () => ({ message: "Role must be either admin or staff" }),
  }),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  email: z.string().trim().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z
    .enum(["admin", "staff"], {
      errorMap: () => ({ message: "Role must be either admin or staff" }),
    })
    .optional(),
});
