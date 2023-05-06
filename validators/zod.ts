import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'bad type!' };
    }
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `less-than-${(issue.params || {}).minimum}` };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export const getError = (error: Error) =>
  error instanceof z.ZodError
    ? error.issues.map((issue) => issue.message).join(' - ')
    : error.message;
export default z;
