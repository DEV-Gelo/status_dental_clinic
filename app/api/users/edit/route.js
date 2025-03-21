import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const {
      id,
      firstName,
      lastName,
      patronymic,
      phone,
      email,
      specialization,
      photo,
    } = data;

    const userId = Number(id);
    const photoUrl = photo || null;

    // Looking for a user with the same email or phone number, but **with a different id**
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return new NextResponse(
          JSON.stringify({ message: "This email already exists" }),
          { status: 400 }
        );
      }
      if (existingUser.phone === phone) {
        return new NextResponse(
          JSON.stringify({ message: "This phone number already exists" }),
          { status: 400 }
        );
      }
    }

    // User update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        patronymic,
        phone,
        email,
        specialization,
        photo: photoUrl,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update user" }),
      { status: 500 }
    );
  }
}
