import { supabase } from "@/lib/supabase"; // підключаємо supabase
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  try {
    // Отримуємо дані форми
    const formData = await req.formData();
    const file = formData.get("file");

    // Перевірка на наявність файлу
    if (!file) {
      return NextResponse.json({ status: "fail", error: "No file provided" });
    }

    // Завантажуємо файл в Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads") // назва твого бакету
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      return NextResponse.json(
        { status: "fail", error: error.message },
        { status: 500 }
      );
    }

    // Отримуємо публічний URL файлу
    const publicUrl = supabase.storage.from("uploads").getPublicUrl(data.path)
      .data.publicUrl;

    // Оновлюємо сторінку після завантаження
    revalidatePath("/");

    return NextResponse.json({ status: "success", url: publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Логіка для PUT-запиту, якщо потрібно оновити файл
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file provided");
    }

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (error) {
      throw new Error(error.message);
    }

    const publicUrl = supabase.storage.from("uploads").getPublicUrl(data.path)
      .data.publicUrl;

    return NextResponse.json({ status: "success", url: publicUrl });
  } catch (e) {
    console.error("Error in PUT:", e.message);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 }
    );
  }
}
