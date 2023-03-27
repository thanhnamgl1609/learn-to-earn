import { z } from 'zod';

export const APPLY_TEACHER_VALIDATOR = z.object({
  fullName: z.string().nonempty(),
  profileImage: z.string().nonempty(),
  documentURIs: z.array(z.string()).nonempty(),
});
