import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const honoUrl = process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL;
//   // Fetch the session (authentication) token if necessary
//   /const token = request.cookies.get("next-auth.session-token");

//   // Check if token exists (optional, depending on your authentication requirements)
//   // if (!token) {
//   //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   // }

//   // Forward the request to the Hono backend
//   console.log(honoUrl);
//   try {
//     const honoResponse = await fetch(`${honoUrl}`, {
//       method: "GET",
//       // headers: {
//       //   Authorization: `Bearer ${token}`,
//       // },
//     });

//     const data = await honoResponse.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json("nothing error");
//   }
// }

export async function GET(request: NextRequest) {
  const honoUrl = process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL;

  if (!honoUrl) {
    throw new Error("Backend URL is not defined in environment variables.");
  }

  const token = request.cookies.get("authjs.session-token");
  console.log(token);
  try {
    const honoResponse = await fetch(`${honoUrl}/auth/protected`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        Accept: "application/json",
      },
    });

    // Check for non-JSON responses
    const contentType = honoResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await honoResponse.json();
      return NextResponse.json(data);
    } else {
      const errorText = await honoResponse.text();
      console.error("Non-JSON response from Hono backend:", errorText);
      return NextResponse.json(
        { error: errorText },
        { status: honoResponse.status },
      );
    }
  } catch (error: any) {
    console.error("Error fetching from Hono backend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
