import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST request to add/update data

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, ...contactData } = data;

    const contact = await prisma.contact.upsert({
      where: { id: id || 1 },
      update: contactData,
      create: contactData,
    });

    return NextResponse.json(
      { message: "Data saved", contact: contact },
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

// GET contact request
export async function GET() {
  try {
    const contact = await prisma.contact.findMany();
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
