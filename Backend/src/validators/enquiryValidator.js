import { z } from "zod";

export const createEnquirySchema = z.object({
  customerName: z
    .string({ required_error: "Customer name is required" })
    .trim()
    .min(2, "Customer name must be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(7, "Phone number must be at least 7 characters"),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(5, "Message must be at least 5 characters"),
  status: z
    .enum(["New", "In Progress", "Closed"], {
      errorMap: () => ({
        message: "Status must be New, In Progress, or Closed",
      }),
    })
    .optional(),
  assignedTo: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),
});

export const updateEnquirySchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .optional(),
  email: z.string().trim().email("Invalid email address").optional(),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .optional(),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .optional(),
  status: z
    .enum(["New", "In Progress", "Closed"], {
      errorMap: () => ({
        message: "Status must be New, In Progress, or Closed",
      }),
    })
    .optional(),
  assignedTo: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),
});
