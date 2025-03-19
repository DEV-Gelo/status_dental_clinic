import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const user = await prisma.user.findMany();
    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
