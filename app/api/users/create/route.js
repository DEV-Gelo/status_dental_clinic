import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  const {
    lastName,
    firstName,
    patronymic,
    role,
    specialization,
    phone,
    email,
    photo,
  } = data;

  // Checking and assigning null to the photo if it doesn't exist
  const photoUrl = photo ? photo : null;

  try {
    // Create a new user
    const user = await prisma.user.create({
      data: {
        lastName,
        firstName,
        patronymic,
        role,
        specialization,
        phone,
        email,
        photo: photoUrl,
      },
    });

    const response = NextResponse.json(user, { status: 201 });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
