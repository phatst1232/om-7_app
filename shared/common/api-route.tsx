export const DOMAIN = process.env.NEXT_PUBLIC_SYSTEM_DOMAIN as string;

// NextAuth
export const NEXT_AUTH_LOGIN_ROUTE = 'api/auth';

// NestJS Auth Route
export const LOGIN_GOOGLE_ROUTE = process.env.NEXT_PUBLIC_LOGIN_GOOGLE_ROUTE; //

export const LOGIN_ROUTE = DOMAIN + process.env.NEXT_PUBLIC_LOGIN_ROUTE;

export const REGISTER_ROUTE = process.env.NEXT_PUBLIC_REGISTER_ROUTE;

export const LOGOUT_ROUTE = process.env.NEXT_PUBLIC_LOGOUT_ROUTE;

export const VALIDATE_REDIS_SESSION_ROUTE =
  process.env.NEXT_PUBLIC_VALIDATE_REDIS_SESSION_ROUTE;
// User Route
export const RESET_USER_PASSWORD_ROUTE =
  process.env.NEXT_PUBLIC_RESET_USER_PASSWORD_ROUTE;

export const MAIL_VERIFY_RESET_PW_ROUTE =
  process.env.NEXT_PUBLIC_MAIL_VERIFY_RESET_PW_ROUTE;

export const GET_USER_ROUTE = DOMAIN + process.env.NEXT_PUBLIC_GET_USER_ROUTE;

export const GET_ALL_USER_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_GET_ALL_USER_ROUTE;

export const UPDATE_USER_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_USER_ROUTE;

export const UPDATE_USER_STATUS_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_USER_STATUS_ROUTE;

export const DELETE_USER_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_DELETE_USER_ROUTE;
// role route
export const GET_ALL_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_GET_ALL_ROLE_ROUTE;

export const UPDATE_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_ROLE_ROUTE;

export const CREATE_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_CREATE_ROLE_ROUTE;

export const UPDATE_ROLE_STATUS_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_ROLE_STATUS_ROUTE;

export const DELETE_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_DELETE_ROLE_ROUTE;
// permission route
export const GET_ALL_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_GET_ALL_PERMISSION_ROUTE;

export const UPDATE_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_PERMISSION_ROUTE;

export const UPDATE_PERMISSION_STATUS_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_PERMISSION_STATUS_ROUTE;

export const DELETE_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_DELETE_PERMISSION_ROUTE;

export const CREATE_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_CREATE_PERMISSION_ROUTE;
//
