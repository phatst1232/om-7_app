import { DOMAIN, LOGIN_GOOGLE_ROUTE, LOGIN_ROUTE } from "@/shared/common/api-route"
import axios, { AxiosError } from 'axios';

export async function getToken(username: string, password: string) {
  try {
    const response = await axios.post(LOGIN_ROUTE, {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.log('Catched error: ' + error);
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
  }
}

export async function LoginGoogleAPI() {
  window.location.assign(DOMAIN + LOGIN_GOOGLE_ROUTE)
}

// export async function LogoutUserAPI(): Promise<boolean> {
//   const accessToken = getToken()
//   const response = await fetch(DOMAIN + LOGOUT_ROUTE, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })

//   if (!response.ok) {
//     alert(JSON.parse(await response.text()).message.toUpperCase())
//     return false
//   } else {
//     return true
//   }
// }