import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const category = await prisma.category.findMany();
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Помилка:", error);
    return NextResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Назва не може бути порожньою" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(
      { message: "Дані збережено", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Помилка:", error);
    return NextResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
