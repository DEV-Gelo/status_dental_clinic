import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`./public/uploads/${file.name}`, buffer);

    revalidatePath("/");

    return NextResponse.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    return NextResponse.json({
      status: "success",
      path: (`/uploads/${file.name}`, buffer),
    });
  } catch (e) {
    console.error("Error in PUT:", e.message);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 }
    );
  }
}
