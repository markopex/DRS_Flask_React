// import { createAuthProvider } from "react-token-auth";

// export const [useAuth, authFetch, login, logout] = createAuthProvider({
//   accessTokenKey: "access_token",
//   onUpdateToken: (token) =>
//     fetch("http://localhost:5000/auth/refresh", {
//       method: "POST",
//       body: token.refresh_token,
//     }).then((r) => r.json()),
// });

import { createAuthProvider } from "react-token-auth";

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  getAccessToken: (session) => session.accessToken,
  storage: localStorage,
  onUpdateToken: (token) =>
    fetch("/update-token", {
      method: "POST",
      body: token.refreshToken,
    }).then((r) => r.json()),
});
