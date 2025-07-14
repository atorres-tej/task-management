import { z } from "zod"

// Validation schema for task form
export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters")
    .trim(),
  
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      return selectedDate >= today
    }, "Due date cannot be in the past"),
  
  statusId: z
    .number()
    .optional()
    .nullable(),
  
  assignedTo: z
    .number()
    .optional()
    .nullable(),
})

// TypeScript type derived from schema
export type TaskFormSchema = z.infer<typeof taskFormSchema>

// Schema for when editing a task (statusId is required)
export const editTaskFormSchema = taskFormSchema.extend({
  statusId: z
    .number({
      required_error: "Status is required",
      invalid_type_error: "Must select a valid status"
    })
    .min(1, "Must select a status")
})

export type EditTaskFormSchema = z.infer<typeof editTaskFormSchema>
