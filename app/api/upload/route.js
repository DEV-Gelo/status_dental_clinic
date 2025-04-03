// ----Uploading a file to the storage in backblaze----//
import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import crypto from "crypto";

// Конфігурація AWS S3 (Backblaze B2)
const s3 = new AWS.S3({
  endpoint: process.env.BACKBLAZE_ENDPOINT, // Наприклад: https://s3.us-west-001.backblazeb2.com
  accessKeyId: process.env.BACKBLAZE_KEY_ID,
  secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY,
  signatureVersion: "v4",
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Генеруємо унікальне ім'я файлу
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

    // Читаємо файл у буфер
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Завантажуємо у Backblaze B2
    const params = {
      Bucket: process.env.BACKBLAZE_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read",
    };

    await s3.upload(params).promise();

    const fileUrl = `${process.env.BACKBLAZE_ENDPOINT}/${process.env.BACKBLAZE_BUCKET_NAME}/${fileName}`;

    return NextResponse.json({ status: "success", fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return NextResponse.json(
      { status: "fail", error: error.message },
      { status: 500 }
    );
  }
}

// ----------Method PUT--------------//

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
      const oldFileKey = user.photo.split("/").pop();
      await s3
        .deleteObject({
          Bucket: process.env.BACKBLAZE_BUCKET_NAME,
          Key: oldFileKey,
        })
        .promise();
    }

    // Генеруємо унікальне ім'я нового файлу
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Завантажуємо новий файл
    await s3
      .upload({
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: "public-read",
      })
      .promise();

    // Новий URL
    const fileUrl = `${process.env.BACKBLAZE_ENDPOINT}/${process.env.BACKBLAZE_BUCKET_NAME}/${fileName}`;

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
