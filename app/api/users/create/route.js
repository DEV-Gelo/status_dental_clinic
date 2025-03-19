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
    photo, // photo тепер буде містити URL
  } = data;

  // Якщо фото було завантажене, використовуємо URL
  const photoUrl = photo ? photo : null;

  try {
    // Перевіряємо, чи існує користувач з таким email або phone
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

    // Створюємо нового користувача
    const user = await prisma.user.create({
      data: {
        lastName,
        firstName,
        patronymic,
        role,
        specialization,
        phone,
        email,
        photo: photoUrl, // Зберігаємо URL фото
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
