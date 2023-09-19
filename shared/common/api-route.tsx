export const DOMAIN = process.env.NEXT_PUBLIC_SYSTEM_DOMAIN as string;

// NextAuth
export const NEXT_AUTH_LOGIN_ROUTE = 'api/auth'; //as RequestInfo;

// NestJS Auth Route
export const LOGIN_GOOGLE_ROUTE = process.env.NEXT_PUBLIC_LOGIN_GOOGLE_ROUTE; //as RequestInfo; //

export const LOGIN_ROUTE = DOMAIN + process.env.NEXT_PUBLIC_LOGIN_ROUTE; //as RequestInfo;

export const REGISTER_ROUTE = process.env.NEXT_PUBLIC_REGISTER_ROUTE; //as RequestInfo;

export const LOGOUT_ROUTE = process.env.NEXT_PUBLIC_LOGOUT_ROUTE; //as RequestInfo;

export const VALIDATE_REDIS_SESSION_ROUTE =
  process.env.NEXT_PUBLIC_VALIDATE_REDIS_SESSION_ROUTE; //as RequestInfo;
// User Route
export const RESET_USER_PASSWORD_ROUTE =
  process.env.NEXT_PUBLIC_RESET_USER_PASSWORD_ROUTE; //as RequestInfo;

export const MAIL_VERIFY_RESET_PW_ROUTE =
  process.env.NEXT_PUBLIC_MAIL_VERIFY_RESET_PW_ROUTE; //as RequestInfo;

export const GET_USER_ROUTE = DOMAIN + process.env.NEXT_PUBLIC_GET_USER_ROUTE; //as RequestInfo;

export const GET_ALL_USER_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_GET_ALL_USER_ROUTE; //as RequestInfo;

export const UPDATE_USER_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_USER_ROUTE; //as RequestInfo;

export const UPDATE_USER_STATUS_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_USER_STATUS_ROUTE; //as RequestInfo;

export const DELETE_USER_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_DELETE_USER_ROUTE; //as RequestInfo;
// role route
export const GET_ALL_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_GET_ALL_ROLE_ROUTE; //as RequestInfo;

export const UPDATE_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_ROLE_ROUTE; //as RequestInfo;

export const UPDATE_ROLE_STATUS_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_ROLE_STATUS_ROUTE; //as RequestInfo;

export const DELETE_ROLE_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_DELETE_ROLE_ROUTE; //as RequestInfo;
// permission route
export const GET_ALL_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_GET_ALL_PERMISSION_ROUTE; //as RequestInfo;

export const UPDATE_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_PERMISSION_ROUTE; //as RequestInfo;

export const UPDATE_PERMISSION_STATUS_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_UPDATE_PERMISSION_STATUS_ROUTE; //as RequestInfo;

export const DELETE_PERMISSION_ROUTE =
  DOMAIN + process.env.NEXT_PUBLIC_DELETE_PERMISSION_ROUTE;

///
export const GET_LIST_PERMISSION_ROUTE =
  process.env.NEXT_PUBLIC_GET_LIST_PERMISSION_ROUTE; //as RequestInfo;

export const EDIT_ROLE_PERMISSION_ROUTE =
  process.env.NEXT_PUBLIC_EDIT_ROLE_PERMISSION_ROUTE; //as RequestInfo;

export const CREATE_PERMISSION_ROUTE =
  process.env.NEXT_PUBLIC_CREATE_PERMISSION_ROUTE; //as RequestInfo;
