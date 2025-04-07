import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import crypto from "crypto";

const s3 = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT, // Wasabi endpoint
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded");
    }

    const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadParams = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    };

    try {
      const response = await s3.send(new PutObjectCommand(uploadParams));

      // Тепер генеруємо правильний URL для файлу
      const fileUrl = `https://s3.us-east-1.wasabisys.com/${process.env.WASABI_BUCKET_NAME}/${fileName}`;
      console.log("Generated file URL:", fileUrl);

      return NextResponse.json({ status: "success", fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { status: "fail", error: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return NextResponse.json(
      { status: "fail", error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 UPDATE FILE (PUT)

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) {
      throw new Error("File and userId are required");
    }

    // Отримуємо поточний URL фото з бази
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { photo: true },
    });

    if (!user) throw new Error("User not found");

    // Видаляємо старий файл (якщо є)
    if (user.photo) {
      const oldFileKey = user.photo.split("/").pop(); // Беремо назву файлу
      const deleteParams = {
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: oldFileKey,
      };
      await s3.send(new DeleteObjectCommand(deleteParams)); // Видалення старого файлу
    }

    // Генеруємо унікальне ім'я нового файлу
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Завантажуємо новий файл
    const uploadParams = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read", // Можна прибрати, якщо не потрібно
    };
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3.send(uploadCommand);

    // Формуємо правильний URL для доступу до файлу
    const fileUrl = `https://s3.wasabisys.com/${process.env.WASABI_BUCKET_NAME}/${fileName}`;

    // Оновлюємо запис у базі
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { photo: fileUrl },
    });

    return NextResponse.json({ status: "success", fileUrl });
  } catch (error) {
    console.error("Error updating file:", error.message);
    return NextResponse.json(
      { status: "fail", error: error.message },
      { status: 500 }
    );
  }
}

// ----Uploading a file directly to the project in the upload folder----//

// import { NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";
// import fs from "node:fs/promises";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     const file = formData.get("file");
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = new Uint8Array(arrayBuffer);
//     await fs.writeFile(`./public/uploads/${file.name}`, buffer);

//     revalidatePath("/");

//     return NextResponse.json({ status: "success" });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ status: "fail", error: e });
//   }
// }

// export async function PUT(req) {
//   try {
//     const formData = await req.formData();

//     const file = formData.get("file");
//     if (!file) {
//       throw new Error("No file provided");
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = new Uint8Array(arrayBuffer);

//     return NextResponse.json({
//       status: "success",
//       path: (`/uploads/${file.name}`, buffer),
//     });
//   } catch (e) {
//     console.error("Error in PUT:", e.message);
//     return NextResponse.json(
//       { status: "fail", error: e.message },
//       { status: 500 }
//     );
//   }
// }
