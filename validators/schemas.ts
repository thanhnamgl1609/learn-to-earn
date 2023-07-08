import { number, z } from 'zod';

import { after, before } from 'utils';
import { customOptionsWithError } from './custom';
import { SemesterDetail } from '@_types/api/semester';

export const APPLY_VALIDATOR = z
  .object({
    fullName: z.string().nonempty(),
    profileImage: z.string().nonempty(),
    documentURIs: z.array(z.string()).nonempty(),
    gender: z.preprocess((v: string) => parseInt(v), z.number().min(0).max(1)),
    dateOfBirth: z.string(),
    personalEmail: z.string(),
    identityNumber: z.string().nonempty(),
    phone: z.string(),
  })
  .refine(({ dateOfBirth }) => z.date().parse(new Date(dateOfBirth)));

export const GRANT_OR_REJECT_IDENTITY = z
  .object({
    expiredAt: z.string(),
  })
  .refine(({ expiredAt }) => z.date().parse(new Date(expiredAt)));

export const CREATE_COURSE_META = z.object({
  name: z.string().nonempty(),
  knowledgeBlockId: z.preprocess((v: string) => parseInt(v), z.number()),
  courseCode: z.string().nonempty(),
  credits: z.preprocess((v: string) => parseInt(v), z.number()),
  theoryLessons: z.preprocess((v: string) => parseInt(v), z.number()),
  practiceLessons: z.preprocess((v: string) => parseInt(v), z.number()),
  exerciseLessons: z.preprocess((v: string) => parseInt(v), z.number()),
  description: z.string(),
  prevCourseId: z
    .null()
    .or(z.preprocess((v: string) => parseInt(v), z.number())),
});

export const CREATE_COURSE = z.object({
  prevCourseId: z.preprocess((v: string) => parseInt(v), z.number()),
  knowledgeBlockId: z.preprocess((v: string) => parseInt(v), z.number()),
  credits: z.preprocess((v: string) => parseInt(v), z.number().positive()),
  name: z.string().nonempty(),
  description: z.string(),
  isRequired: z.preprocess(
    (v: string) => parseInt(v),
    z.number().min(0).max(1)
  ),
  theoryLessons: z.preprocess((v: string) => parseInt(v), z.number()),
  practiceLessons: z.preprocess((v: string) => parseInt(v), z.number()),
  exerciseLessons: z.preprocess((v: string) => parseInt(v), z.number()),
});

export const REGISTER_TIME = z
  .object({
    registerStartAt: z.preprocess(
      (v: string) => new Date(v),
      z.date(customOptionsWithError('Ngày bắt đầu đăng ký không được rỗng'))
    ),
    registerEndAt: z.preprocess(
      (v: string) => new Date(v),
      z.date(customOptionsWithError('Ngày kết thúc đăng ký không được rỗng'))
    ),
  })
  .refine(
    ({ registerStartAt, registerEndAt }) =>
      after(registerEndAt, registerStartAt),
    {
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    }
  );
export const EXTEND_REGISTER_TIME = (
  schema: z.ZodType<Record<string, any>>,
  semester: SemesterDetail
) =>
  schema
    .refine(({ registerEndAt }) => before(registerEndAt, semester.endAt), {
      message: 'Đăng ký phải trước khi học kì kết thúc',
    })
    .refine(({ registerStartAt }) => after(registerStartAt, semester.startAt), {
      message: 'Đăng ký phải sau khi học kì bắt đầu',
    });

export const CREATE_CLASS = z
  .object({
    courseId: z.preprocess(
      (v: string) => parseInt(v),
      z.number().positive('Chọn môn học')
    ),
    teacherTokenId: z.preprocess(
      (v: string) => parseInt(v),
      z.number().positive('Chọn giảng viên')
    ),
    maxSize: z.preprocess(
      (v: string) => parseInt(v),
      z
        .number(customOptionsWithError('Nhập số lương sinh viên tối đa'))
        .positive('Số lương sinh viên tối đa > 0')
    ),
    semesterId: z.preprocess((v: string) => parseInt(v), z.number().positive()),
    startAt: z.preprocess(
      (v: string) => new Date(v),
      z.date(customOptionsWithError('Ngày bắt đầu không được rỗng'))
    ),
    completeAt: z.preprocess(
      (v: string) => new Date(v),
      z.date(customOptionsWithError('Ngày kết thúc không được rỗng'))
    ),
    registerClassFee: z
      .preprocess(
        (v: string) => parseFloat(v),
        z.number(customOptionsWithError('phí đăng ký không hợp lệ'))
      )
      .transform(String),
  })
  .refine(({ completeAt, startAt }) => after(completeAt, startAt), {
    message: 'Thời gian hoàn thành phải sau thời gian bắt đầu',
  });

export const EXTEND_CREATE_CLASS = (
  schema: z.ZodType<Record<string, any>>,
  semester: SemesterDetail
) =>
  schema
    .refine(({ completeAt }) => before(completeAt, semester.endAt), {
      message: 'Môn học phải kết thúc trước khi học kì kết thúc',
    })
    .refine(({ startAt }) => after(startAt, semester.startAt), {
      message: 'Môn học phải bắt đầu sau khi học kì bắt đầu',
    });

export const CREATE_CLASS_META = z.object({
  course: z.object({
    id: z.number().positive(),
    name: z.string().nonempty(),
  }),
  teacher: z.object({
    tokenId: z.number().positive(),
    name: z.string().nonempty(),
  }),
});

export const CREATE_NFT_COMPLETE_COURSE = z.object({
  tokenId: z.preprocess(
    (i: string) => parseInt(i),
    z.number(customOptionsWithError('Token ID không rỗng'))
  ),
  studentTokenId: z.preprocess(
    (i: string) => parseInt(i),
    z.number(customOptionsWithError('Student ID không rỗng'))
  ),
  classId: z.preprocess(
    (i: string) => parseInt(i),
    z.number(customOptionsWithError('Class ID không rỗng'))
  ),
  avgScore: z.preprocess(
    (i: string) => parseInt(i),
    z.number(customOptionsWithError('ĐTB không rỗng'))
  ),
  tokenURI: z
    .string(customOptionsWithError('sai token URL'))
    .nonempty('sai token URL'),
  grantDate: z.preprocess(
    (v: string) => new Date(v),
    z.date(customOptionsWithError('Ngày bắt đầu đăng ký không được rỗng'))
  ),
});

export const CLASS_ENTITY = z.object({
  id: z.number(),
  onChainId: z.number(),
  courseCode: z.string(),
  knowledgeBlockId: z.number(),
  credits: z.number(),
  startAt: z.preprocess(
    (v: string) => new Date(v),
    z.date(customOptionsWithError('Ngày bắt đầu không được rỗng'))
  ),
  completeAt: z.preprocess(
    (v: string) => new Date(v),
    z.date(customOptionsWithError('Ngày kết thúc không được rỗng'))
  ),
  maxSize: z.number(),
  teacherTokenId: z.number(),
  chainURI: z.string(),
  semesterId: z.number(),
});

export const REQUEST_NFT_GRADUATION = z.object({
  classEntities: z
    .array(CLASS_ENTITY)
    .nonempty('Chọn đủ tín chỉ cho mỗi khối kiến thức'),
  nationalDefenseEduCertificate: z.string(
    customOptionsWithError('Cần chứng chỉ giáo dục quốc phòng')
  ),
  foreignLanguageCertificate: z.string(
    customOptionsWithError('Cần chứng chỉ ngoại ngữ')
  ),
  otherCertificates: z.array(z.string(customOptionsWithError('Nhập sai'))),
});

export const GRANT_GRADUATION = z.object({
  studentTokenId: z.number(customOptionsWithError('Thiếu mã sinh viên')),
  nftCompleteCourseTokenIds: z.array(
    z.number(),
    customOptionsWithError('Chọn đủ tín chỉ cho mỗi khối kiến thức')
  ),
  requestPrice: z.string(),
  requestURI: z.string(),
});
