import MockAxiosAdapter from 'npm:axios-mock-adapter'
import axios from 'npm:axios'
import { Response } from 'npm:express'
import { Print } from '../utilities/static/Print.ts'

const print = new Print()
// deno-lint-ignore-file no-explicit-any
export const MockResponser = {
  send_accepted: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 202,
    status: 'ACCEPTED',
  }),
  send_badGateway: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 502,
    status: 'BAD_GATEWAY',
  }),
  send_badRequest: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 400,
    status: 'BAD_REQUEST',
  }),
  send_conflict: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 409,
    status: 'CONFLICT',
  }),
  send_continue: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 100,
    status: 'CONTINUE',
  }),
  send_created: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 201,
    status: 'CREATED',
  }),
  send_expectationFailed: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 417,
    status: 'EXPECTATION_FAILED',
  }),
  send_failedDependency: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 424,
    status: 'FAILED_DEPENDENCY',
  }),
  send_forbidden: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 403,
    status: 'FORBIDDEN',
  }),
  send_gatewayTimeout: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 504,
    status: 'GATEWAY_TIMEOUT',
  }),
  send_gone: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 410,
    status: 'GONE',
  }),
  send_httpVersionNotSupported: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 505,
    status: 'HTTP_VERSION_NOT_SUPPORTED',
  }),
  send_imATeapot: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 418,
    status: 'I_AM_A_TEAPOT',
  }),
  send_insufficientSpaceOnResource: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 419,
    status: 'INSUFFICIENT_SPACE_ON_RESOURCE',
  }),
  send_insufficientStorage: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 507,
    status: 'INSUFFICIENT_STORAGE',
  }),
  send_internalServerError: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
  }),
  send_lengthRequired: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 411,
    status: 'LENGTH_REQUIRED',
  }),
  send_locked: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 423,
    status: 'LOCKED',
  }),
  send_methodFailure: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 420,
    status: 'METHOD_FAILURE',
  }),
  send_methodNotAllowed: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 405,
    status: 'METHOD_NOT_ALLOWED',
  }),
  send_movedPermanently: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 301,
    status: 'MOVED_PERMANENTLY',
  }),
  send_movedTemporarily: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 302,
    status: 'MOVED_TEMPORARILY',
  }),
  send_multiStatus: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 207,
    status: 'MULTI_STATUS',
  }),
  send_multipleChoices: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 300,
    status: 'MULTIPLE_CHOICES',
  }),
  send_networkAuthenticationRequired: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 511,
    status: 'NETWORK_AUTHENTICATION_REQUIRED',
  }),
  send_noContent: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 204,
    status: 'NO_CONTENT',
  }),
  send_nonAuthoritativeInformation: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 203,
    status: 'NON_AUTHORITATIVE_INFORMATION',
  }),
  send_notAcceptable: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 406,
    status: 'NOT_ACCEPTABLE',
  }),
  send_notFound: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 404,
    status: 'NOT_FOUND',
  }),
  send_notImplemented: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 501,
    status: 'NOT_IMPLEMENTED',
  }),
  send_notModified: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 304,
    status: 'NOT_MODIFIED',
  }),
  send_ok: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 200,
    status: 'OK',
  }),
  send_partialContent: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 206,
    status: 'PARTIAL_CONTENT',
  }),
  send_paymentRequired: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 402,
    status: 'PAYMENT_REQUIRED',
  }),
  send_permanentRedirect: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 308,
    status: 'PERMANENT_REDIRECT',
  }),
  send_preconditionFailed: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 412,
    status: 'PRECONDITION_FAILED',
  }),
  send_preconditionRequired: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 428,
    status: 'PRECONDITION_REQUIRED',
  }),
  send_processing: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 102,
    status: 'PROCESSING',
  }),
  send_proxyAuthenticationRequired: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 407,
    status: 'PROXY_AUTHENTICATION_REQUIRED',
  }),
  send_requestHeaderFieldsTooLarge: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 431,
    status: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
  }),
  send_requestTimeout: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 408,
    status: 'REQUEST_TIMEOUT',
  }),
  send_requestTooLong: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 413,
    status: 'REQUEST_TOO_LONG',
  }),
  send_requestUriTooLong: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 414,
    status: 'REQUEST_URI_TOO_LONG',
  }),
  send_requestedRangeNotSatisfiable: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 416,
    status: 'REQUESTED_RANGE_NOT_SATISFIABLE',
  }),
  send_resetContent: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 205,
    status: 'RESET_CONTENT',
  }),
  send_seeOther: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 303,
    status: 'SEE_OTHER',
  }),
  send_serviceUnavailable: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 503,
    status: 'SERVICE_UNAVAILABLE',
  }),
  send_switchingProtocols: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 101,
    status: 'SWITCHING_PROTOCOLS',
  }),
  send_temporaryRedirect: (message: string, data?: unknown) => ({
    success: true,
    message,
    data,
    code: 307,
    status: 'TEMPORARY_REDIRECT',
  }),
  send_tooManyRequests: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 429,
    status: 'TOO_MANY_REQUESTS',
  }),
  send_unauthorized: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 401,
    status: 'UNAUTHORIZED',
  }),
  send_unprocessableEntity: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 422,
    status: 'UNPROCESSABLE_ENTITY',
  }),
  send_unsupportedMediaType: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 415,
    status: 'UNSUPPORTED_MEDIA_TYPE',
  }),
  send_useProxy: (message: string, data?: unknown) => ({
    success: false,
    errors: data,
    message,
    code: 305,
    status: 'USE_PROXY',
  }),
} as unknown as Response

export const MockDatabase = {
  startSession: () =>
    Promise.resolve({
      startTransaction: () => {},
      abortTransaction: () => Promise.resolve(),
      commitTransaction: () => Promise.resolve(),
      endSession: () => {},
    }),
}

// @ts-ignore mock axios adapter
export const MockAdapter = new MockAxiosAdapter(axios)

export const MockNextFunction = (value: any) => print.error(value.message)

// const translations = JSON.parse(
//   Deno.readTextFileSync("./locales/pt-BR/translation.json"),
// );

// export const MockTranslationFunction = (key: string) => {
//   const keys = key.split(".");
//   let value = translations;

//   for (const k of keys) {
//     if (!value[k]) return key;
//     value = value[k];
//   }

//   return value;
// };
