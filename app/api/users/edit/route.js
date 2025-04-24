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
    const photoUrl = photo || "/image-placeholder.svg";

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
