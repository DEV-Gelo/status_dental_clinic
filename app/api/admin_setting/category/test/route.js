import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const { name, order } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    if (order !== null && typeof order !== "number") {
      return NextResponse.json(
        { message: "Order must be a number" },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name cannot be empty" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, order },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "The category has been deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
