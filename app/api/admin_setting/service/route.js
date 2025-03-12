import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.services.findMany();
    return NextResponse.json(services, { status: 200 });
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
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "The name cannot be empty" },
        { status: 400 }
      );
    }

    const newService = await prisma.services.create({
      data: { name },
    });

    return NextResponse.json(
      { message: "Data saved", service: newService },
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
