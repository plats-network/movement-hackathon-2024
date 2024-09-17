
import { apiClient, apiClientAuth } from "@/apiRequest/apiClient"

const authApiRequest = {
    nonce: (publicKey: string) => apiClient.get(`/auth/nonce?public_key=${publicKey}`),
    verify: (body: any) => apiClient.post(`/auth/verify`, body),
    auth: (body: { authenToken: string}) =>
        apiClientAuth.post("/api/auth", body),

   
}


export default authApiRequest