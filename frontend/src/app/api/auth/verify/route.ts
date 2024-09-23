import authApiRequest from "@/apiRequest/auth";


export async function POST(request: Request) {
    try {
      const res = await request.json();      
      const resVerify = await authApiRequest.verify(res)
      return new Response(JSON.stringify({ message: resVerify.payload.data.msg, data: resVerify.payload.data.data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error: any) {
      console.log("🚀 ~ POST ~ error:", error);
      
      return new Response(JSON.stringify({ message: "Error", error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  