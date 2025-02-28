import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const parsedBody = await req.json();

    if (!parsedBody || !parsedBody.password) {
      return NextResponse.json(
        { success: false, message: "Please enter a password" },
        { status: 400 }
      );
    }

    const { password } = parsedBody;

    if (password === process.env.ADMIN_PASSWORD) {
      // Set the cookie
      const response = NextResponse.json({ success: true });

      // Add a cookie to the header
      response.headers.set(
        "Set-Cookie",
        `auth=true; HttpOnly; Path=/admin; Max-Age=3600`
      );

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
