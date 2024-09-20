
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  if (force) {
    //bat buoc xoa cookie token

    return new Response(JSON.stringify({ message: "Logout successful" }), {
      status: 200,
      headers: {
        //xoa cookie token
        "Set-Cookie": `accessToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  }
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    return new Response(JSON.stringify({ message: "Invalid accessToken" }), {
      status: 401,
    });
  }

  try {
  

    return new Response(JSON.stringify({ message: "Logout successful" }), {
      status: 200,
      headers: {
        //xoa cookie token
        "Set-Cookie": `accessToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
   
  } catch (error: any) {
      return new Response(JSON.stringify({ message: "Error", error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}
