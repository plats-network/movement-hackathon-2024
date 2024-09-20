import apiClient from "@/apiRequest/apiClient";
import { clientAccessToken } from "@/lib/utils";

const accountApiRequest = {
  user: (accessToken: string) =>
    apiClient.get("/user", {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  addTwitter: (platId: string) =>
    apiClient.get(`/twitter/login`, {
      params: { plat_id: platId },
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${clientAccessToken?.value}`,
      }, // Không gửi credentials
    }),
};

export default accountApiRequest;
