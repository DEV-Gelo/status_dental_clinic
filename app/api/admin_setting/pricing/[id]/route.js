import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, context) {
  const { id } = context.params;

  try {
    const { name, price, categoryId } = await req.json();

    if (!id || !Number.isInteger(Number(id))) {
      return NextResponse.json({ error: "Некоректний ID" }, { status: 400 });
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Назва послуги не може бути порожньою" },
        { status: 400 }
      );
    }

    if (!price || !Number.isInteger(Number(price))) {
      return NextResponse.json(
        { error: "Некоректне значення" },
        { status: 400 }
      );
    }

    const updatedPricing = await prisma.pricing.update({
      where: { id: Number(id) },
      data: { name, price, categoryId },
    });

    return NextResponse.json(updatedPricing, { status: 200 });
  } catch (error) {
    console.error("Помилка API:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { id } = context.params;

  try {
    if (!id || !Number.isInteger(Number(id))) {
      return NextResponse.json({ error: "Некоректний ID" }, { status: 400 });
    }

    // Check if the price exists before deleting
    const existingPrice = await prisma.pricing.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPrice) {
      return NextResponse.json(
        { error: "Запис не знайдений" },
        { status: 404 }
      );
    }

    await prisma.pricing.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "Запис успішно видалено" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Помилка API:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
