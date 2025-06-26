import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const category = await prisma.category.findMany();
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, order } = await req.json();

    if (order !== null && typeof order !== "number") {
      return NextResponse.json(
        { message: "Order must be a number" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { message: "The name cannot be empty" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name, order },
    });

    return NextResponse.json(
      { message: "Data saved", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Помилка:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
