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
    const existingService = await prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete the record
    await prisma.services.delete({
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
