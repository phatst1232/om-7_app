import {
  LOGIN_GOOGLE_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  DOMAIN,
} from "../../../shared/common/api-route";

export async function LoginUserAPI(email: string, password: string) {
  const response = await fetch(DOMAIN + LOGIN_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    alert(JSON.parse(await response.text()).message.toUpperCase());
    return "";
  } else {
    return JSON.parse(await response.text()).accessToken;
  }
}

export async function LoginGoogleAPI() {
  window.location.assign(DOMAIN + LOGIN_GOOGLE_ROUTE);
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
