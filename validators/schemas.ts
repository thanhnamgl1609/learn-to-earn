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

export const CREATE_COURSE_META = z.object({
  name: z.string().nonempty(),
});

export const CREATE_COURSE = z.object({
  prevCourseId: z.preprocess((v: string) => parseInt(v), z.number()),
  knowledgeBlockId: z.preprocess((v: string) => parseInt(v), z.number()),
  credits: z.preprocess((v: string) => parseInt(v), z.number().positive()),
  name: z.string().nonempty(),
});
