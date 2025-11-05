import { z } from 'zod';

export const courseRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be valid'),
  courseId: z.string(),
  participants: z.number().min(1).max(10),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

export type CourseRegistrationData = z.infer<typeof courseRegistrationSchema>;
