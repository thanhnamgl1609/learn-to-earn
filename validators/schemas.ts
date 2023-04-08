import { z } from 'zod';

export const APPLY_VALIDATOR = z.object({
  fullName: z.string().nonempty(),
  profileImage: z.string().nonempty(),
  documentURIs: z.array(z.string()).nonempty(),
});
