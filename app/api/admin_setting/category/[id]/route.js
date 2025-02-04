import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const { name } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Некоректний ID категорії" },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Назва категорії не може бути порожньою" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Помилка API:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Некоректний ID категорії" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "Категорію видалено" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Помилка API:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
