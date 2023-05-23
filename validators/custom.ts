export const customError = (message: string) => () => ({
  message,
});

export const customOptionsWithError = (
  errorMessage: string,
  options?: {
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
  }
) => ({
  errorMap: customError(errorMessage),
  ...options,
});
