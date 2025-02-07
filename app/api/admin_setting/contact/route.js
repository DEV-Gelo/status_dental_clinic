import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST request to add/update data

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Отримані дані:", data);
    const { id, ...contactData } = data;

    const contact = await prisma.contact.upsert({
      where: { id: id || 1 },
      update: contactData,
      create: contactData,
    });

    return NextResponse.json(
      { message: "Дані збережено", contact: contact },
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

// GET contact request
export async function GET() {
  try {
    const contact = await prisma.contact.findMany();
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("Помилка отримання даних:", error);
    return NextResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
