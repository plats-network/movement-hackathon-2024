
import http from "@/lib/http";


const accountApiRequest = {
  user: (url:string) =>
    http.get(url, {
      cache:'no-store'
    }
    ),

    addTwitter: (platId: string) =>
      http.get(`/twitter/login?plat_id=${platId}`),
    addNewWallet: (body: any) =>
      http.put(`/user/address`, body),

};

export default accountApiRequest;
