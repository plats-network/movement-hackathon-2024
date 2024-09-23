import http from "@/lib/http";


const authApiRequest = {
  nonce: (publicKey: string) =>
    http.get(`/auth/nonce?public_key=${publicKey}`),
  verify: (body: any) =>
    http.post(`/auth/verify`, body),
  verifyFromClientToServer: (body: any) =>
    http.post("/api/auth/verify", body, {
      baseUrl:""
    }),
  register: (body: any, authenToken: string) =>
    http.post("/auth/register", body,
      {
        headers: {
          Authorization: `Bearer ${authenToken}`,
        },
      }

    ),

    login: (authenToken: string) =>
      http.post("/auth/login", null,
        {
          headers: {
            Authorization: `Bearer ${authenToken}`,
          },
        }

      ),
  auth: (body: { accessToken: string }) =>
    http.post("/api/auth", body, {
     baseUrl:""
    }),
    logoutFromNextClientToNextServer: (
      force?: boolean | undefined,
      signal?: AbortSignal | undefined
    ) =>
      http.post(
        "/api/auth/logout",
        {
          force,
        },
        { baseUrl: "",
          signal,
        }
      ),
  
};

export default authApiRequest;
