import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function GET(req, context) {
  return NextResponse.json(
    { message: "GET method not supported" },
    { status: 405 }
  );
}

export async function PUT(req, context) {
  const { id } = context.params;

  try {
    const { name, price, description, categoryId } = await req.json();

    if (!id || !Number.isInteger(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "The service name cannot be empty" },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { error: "The price cannot be empty" },
        { status: 400 }
      );
    }

    const updatedPricing = await prisma.pricing.update({
      where: { id: Number(id) },
      data: { name, price, description, categoryId },
    });

    return NextResponse.json(updatedPricing, { status: 200 });
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { id } = context.params;

  try {
    if (!id || !Number.isInteger(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if the price exists before deleting
    const existingPrice = await prisma.pricing.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPrice) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await prisma.pricing.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
