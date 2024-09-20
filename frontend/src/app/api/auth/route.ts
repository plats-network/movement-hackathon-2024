

export async function POST(request: Request) {
    const res = await request.json();
    const accessToken = res.accessToken as string;
    if (!accessToken) {
      return Response.json(
        { message: " khong co authenToken" },
        {
          status: 400,
        }
      );
    }
  

     return Response.json(
      { res },
      {
        status: 200,
        headers: {
          "Set-Cookie": `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Secure`,
        },
      }
    );
  }
  