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
    const { name, price, description, categoryId } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { message: "The service name cannot be empty" },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { message: "The price cannot be empty" },
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
        price: price,
        description: description,
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
