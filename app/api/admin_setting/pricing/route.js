import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const priceList = await prisma.pricing.findMany();
    return NextResponse.json(priceList, { status: 200 });
  } catch (error) {
    console.error("Помилка отримання даних:", error);
    return NextResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, price, categoryId } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Назва послуги не може бути порожньою" },
        { status: 400 }
      );
    }

    if (!price || isNaN(Number(price))) {
      return NextResponse.json(
        { message: "Вартість має бути числом" },
        { status: 400 }
      );
    }

    if (!categoryId || isNaN(Number(categoryId))) {
      return NextResponse.json(
        { message: "Категорія є обов'язковою" },
        { status: 400 }
      );
    }

    const newPrice = await prisma.pricing.create({
      data: {
        name: name.trim(),
        price: Number(price),
        categoryId: Number(categoryId),
      },
    });

    return NextResponse.json(
      { message: "Дані збережено", price: newPrice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Помилка збереження:", error);
    return NextResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
