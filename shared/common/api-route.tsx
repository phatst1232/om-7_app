export const DOMAIN = process.env.NEXT_PUBLIC_SYSTEM_DOMAIN as string;

// Auth Route
export const LOGIN_GOOGLE_ROUTE = process.env
  .NEXT_PUBLIC_LOGIN_GOOGLE_ROUTE ; //as RequestInfo; //

export const LOGIN_ROUTE = DOMAIN + process.env.NEXT_PUBLIC_LOGIN_ROUTE ; //as RequestInfo;

export const REGISTER_ROUTE = process.env
  .NEXT_PUBLIC_REGISTER_ROUTE ; //as RequestInfo;

export const LOGOUT_ROUTE = process.env.NEXT_PUBLIC_LOGOUT_ROUTE ; //as RequestInfo;

export const VALIDATE_REDIS_SESSION_ROUTE = process.env
  .NEXT_PUBLIC_VALIDATE_REDIS_SESSION_ROUTE ; //as RequestInfo;
// User Route
export const RESET_USER_PASSWORD_ROUTE = process.env
  .NEXT_PUBLIC_RESET_USER_PASSWORD_ROUTE ; //as RequestInfo;

export const MAIL_VERIFY_RESET_PW_ROUTE = process.env
  .NEXT_PUBLIC_MAIL_VERIFY_RESET_PW_ROUTE ; //as RequestInfo;

export const GET_USER_ROUTE = process.env.NEXT_PUBLIC_GET_USER_ROUTE ; //as RequestInfo;

export const GET_ALL_USER_ROUTE = process.env
  .NEXT_PUBLIC_GET_ALL_USER_ROUTE ; //as RequestInfo;

export const UPDATE_USER_STATUS_ROUTE = process.env
  .NEXT_PUBLIC_UPDATE_USER_STATUS_ROUTE ; //as RequestInfo;

export const GET_LIST_PERMISSION_ROUTE = process.env
  .NEXT_PUBLIC_GET_LIST_PERMISSION_ROUTE ; //as RequestInfo;

export const EDIT_ROLE_PERMISSION_ROUTE = process.env
  .NEXT_PUBLIC_EDIT_ROLE_PERMISSION_ROUTE ; //as RequestInfo;

export const CREATE_PERMISSION_ROUTE = process.env
  .NEXT_PUBLIC_CREATE_PERMISSION_ROUTE ; //as RequestInfo;
