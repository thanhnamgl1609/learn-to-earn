import { z } from 'zod';

export const APPLY_VALIDATOR = z.object({
  fullName: z.string().nonempty(),
  profileImage: z.string().nonempty(),
  documentURIs: z.array(z.string()).nonempty(),
});

export const GRANT_OR_REJECT_IDENTITY = z
  .object({
    expiredAt: z.string(),
  })
  .refine(({ expiredAt }) => z.date().parse(new Date(expiredAt)));
