import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, phone, userId } = await req.json();

    // Checking if there is a user with the same email or phone, but not the same userId
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
        NOT: { id: userId }, // Exclude the current user
      },
    });

    if (existingUser) {
      const message =
        existingUser.email === email
          ? "This email already exists"
          : "This phone number already exists";

      return NextResponse.json({ message }, { status: 400 });
    }

    // If no conflict, return success message
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
