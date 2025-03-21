import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get email and phone from the request body
    const { email, phone } = await req.json();

    // // Перевіряємо, чи передані необхідні дані
    // if (!email && !phone) {
    //   return NextResponse.json(
    //     { message: "Email or phone is required" },
    //     { status: 400 }
    //   );
    // }

    // Сheck if there is a user with such an email or phone number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "This email already exists" },
          { status: 400 }
        );
      }
      if (existingUser.phone === phone) {
        return NextResponse.json(
          { message: "This phone number already exists" },
          { status: 400 }
        );
      }
    }

    // If the user is not found, we return a successful response.
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
