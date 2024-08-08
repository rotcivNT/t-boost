export enum ApiStatus {
  OK = `ok`,
  ERROR = `error`,
  FORM_ERRORS = `form_errors`,
  REDIRECT = `redirect`,
}

export type ApiSuccess<T extends Record<string, unknown> | unknown = unknown> =
  T & {
    status: ApiStatus.OK;
  };

export type ApiError<T extends Record<string, unknown> = { error: string }> =
  T & {
    status: ApiStatus.ERROR;
  };

export type ApiFormErrors<
  T extends Record<string, unknown> = { errors: Record<string, string> }
> = T & {
  status: ApiStatus.FORM_ERRORS;
};

export type ApiRedirect<T extends Record<string, unknown> = { url: string }> =
  T & {
    status: ApiStatus.REDIRECT;
  };

export type ApiResponse<
  T extends Record<string, unknown> | unknown = unknown,
  K extends Record<string, unknown> = { message: string },
  R extends Record<string, unknown> = { errors: Record<string, string> }
> = ApiSuccess<T> | ApiError<K> | ApiFormErrors<R>;
