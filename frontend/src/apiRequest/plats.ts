import http from "@/lib/http";



const platsApiRequest = {
    app: (url: string) => http.get(url),
   

}

export default platsApiRequest;