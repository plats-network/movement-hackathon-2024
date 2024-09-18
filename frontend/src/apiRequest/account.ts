import { apiClient } from "@/apiRequest/apiClient"
import { clientAccessToken } from "@/lib/utils"




const accountApiRequest = {
    user: (accessToken: string) => apiClient.get('/user', {
        withCredentials: false,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    }),
  
}


export default accountApiRequest