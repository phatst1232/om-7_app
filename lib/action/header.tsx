import { useSession } from 'next-auth/react';

// export function getSessionToken() {
//   const { data: session } = useSession();
//   if (session) {
//     // You can access the session token here
//     const token = session?.user.accessToken;
//     console.log('token   ' + token);
//     return token;
//   }
//   return '';
// }

const commonHeaders = {
  'Content-Type': 'application/json',
};

export function getAuthorizationHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    ...commonHeaders,
  };
}
