import apiClient from "@/apiRequest/apiClient";
import { clientAccessToken } from "@/lib/utils";
import axios from "axios";

const accountApiRequest = {
  user: () =>
    apiClient.get("/user", {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${clientAccessToken?.value}`,
      }, // Không gửi credentials
    }),
  addTwitter: (platId: string, accessToken: string) =>
    apiClient.get(`/twitter/login`, {
      params: { plat_id: platId },
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }, // Không gửi credentials
    }),
  addTwitterFromNextClientToNextServer: (platId: string) =>
    axios.post("/api/auth/twitter", 
      {
        platId: platId,
      }
),
};

export default accountApiRequest;
