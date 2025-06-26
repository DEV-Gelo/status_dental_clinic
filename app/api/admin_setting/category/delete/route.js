import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    // Parse JSON from `body`
    const { id } = await req.json();

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Invalid ID to delete" },
        { status: 400 }
      );
    }

    // Check whether the service exists in the database
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete record
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "The service has been successfully removed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting the service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
