import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    // Parse JSON from `body`
    const { id } = await req.json();

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Некоректний ID для видалення" },
        { status: 400 }
      );
    }

    // Check whether the service exists in the database
    const existingService = await prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Сервіс не знайдено" },
        { status: 404 }
      );
    }

    // Delete the record
    await prisma.services.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Сервіс успішно видалено" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Помилка при видаленні сервісу:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
