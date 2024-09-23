import accountApiRequest from "@/apiRequest/account";
import { cookies } from "next/headers";

// POST API handler
export async function POST(request: Request) {
  try {
    // Lấy dữ liệu từ request body
    const res = await request.json();
    console.log("🚀 ~ POST ~ res:", res);

    // Kiểm tra xem platId có tồn tại trong body request không
    if (!res.platId) {
      return new Response(
        JSON.stringify({ message: "Thiếu platId trong request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Lấy cookies từ header
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");

    // Kiểm tra xem có accessToken hay không
    if (!accessToken) {
      return new Response(
        JSON.stringify({ message: "Không có session token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Gọi API addTwitter với platId và accessToken
    // const response = await accountApiRequest.addTwitter(
    //   res.platId,
    //   accessToken.value
    // );

          
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/twitter/login?plat_id=${res.platId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken?.value}`,
      }
    })
    const result = await response.json()
    console.log("🚀 ~ handleAddTwitterAccount ~ result:", result)

    // Kiểm tra xem response có hợp lệ không
    if (result?.data) {
      // Trả về phản hồi từ API
      return new Response(
        JSON.stringify({
          message: result.data.msg || "Success",
          data: result.data.data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // Trả về lỗi nếu không có dữ liệu hợp lệ từ API
      return new Response(
        JSON.stringify({
          message: "Không nhận được phản hồi hợp lệ từ API",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.log("🚀 ~ POST ~ error:", error);

    // Trả về lỗi nếu có ngoại lệ xảy ra
    return new Response(
      JSON.stringify({
        message: "Đã xảy ra lỗi khi xử lý yêu cầu",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
