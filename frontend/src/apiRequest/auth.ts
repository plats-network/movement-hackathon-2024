import  apiClient  from "@/apiRequest/apiClient";
import axios from "axios";

const authApiRequest = {
  nonce: (publicKey: string) =>
    apiClient.get(`/auth/nonce`, {
      params: { public_key: publicKey },
      withCredentials: false, // Không gửi credentials
    }),
  verify: (body: any) =>
    apiClient.post(`/auth/verify`, JSON.stringify(body), {
      withCredentials: false, // Không gửi credentials
    }),
  verifyFromClientToServer: (body: any) =>
    axios.post("/api/auth/verify", body),
  register: (body: any, authenToken: string) =>
    apiClient.post("/auth/register", JSON.stringify(body), {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${authenToken}`,
      },
    }),

    login: (authenToken: string) =>
      apiClient.post("/auth/login", null, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${authenToken}`,
        },
      }),
  auth: (body: { accessToken: string }) =>
    axios.post("/api/auth", body, {
      withCredentials: false, // Không gửi credentials
    }),
    logoutFromNextClientToNextServer: (
      force?: boolean | undefined,
      signal?: AbortSignal | undefined
    ) =>
      axios.post(
        "/api/auth/logout",
        {
          force,
        },
        {
          signal,
        }
      ),
  
};

export default authApiRequest;
