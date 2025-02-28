import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const priceList = await prisma.pricing.findMany();
    return NextResponse.json(priceList, { status: 200 });
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, price, categoryId } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "The service name cannot be empty" },
        { status: 400 }
      );
    }

    if (!price || isNaN(Number(price))) {
      return NextResponse.json(
        { message: "The value must be a number" },
        { status: 400 }
      );
    }

    if (!categoryId || isNaN(Number(categoryId))) {
      return NextResponse.json(
        { message: "Category is required" },
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
      { message: "Data saved", price: newPrice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
