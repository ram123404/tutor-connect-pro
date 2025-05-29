
import * as z from 'zod';

export const tuitionRequestSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  preferredDays: z.array(z.string()).min(1, 'Select at least one preferred day'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  duration: z.number().min(1, 'Duration must be at least 1 month').max(12, 'Duration cannot exceed 12 months'),
  startDate: z.date().refine((date) => date >= new Date(), 'Start date must be in the future'),
  notes: z.string().optional(),
});

export type TuitionRequestFormData = z.infer<typeof tuitionRequestSchema>;
