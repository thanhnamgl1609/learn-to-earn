import { after, sameOrAfter } from 'utils';
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

export const REGISTER_TIME = z
  .object({
    registerStartAt: z.preprocess((v: string) => new Date(v), z.date()),
    registerEndAt: z.preprocess((v: string) => new Date(v), z.date()),
  })
  .refine(
    ({ registerStartAt, registerEndAt }) =>
      after(registerEndAt, registerStartAt),
    {
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    }
  );

export const CREATE_CLASS = z.object({
  courseId: z.preprocess((v: string) => parseInt(v), z.number().positive()),
  teacherTokenId: z.preprocess(
    (v: string) => parseInt(v),
    z.number().positive()
  ),
  maxSize: z.preprocess((v: string) => parseInt(v), z.number().positive()),
  completeAt: z.preprocess((v: string) => new Date(v), z.date()),
});

export const CREATE_CLASS_META = z.object({
  course: z.object({
    id: z.number().positive(),
    name: z.string().nonempty(),
  }),
  teacher: z.object({
    tokenId: z.number().positive(),
    name: z.string().nonempty(),
  })
});
