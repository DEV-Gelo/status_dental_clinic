// ----Uploading a file to the storage in supabase----//
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Generating a unique name for a file
    const fileName = `${Date.now()}-${file.name}`;

    // Uploading a file to Supabase
    const { data, error } = await supabase.storage
      .from("uploads") // Name of bucket
      .upload(fileName, file, {
        cacheControl: "3600", // Set caching
        upsert: true, // If a file with that name already exists, overwrite it.
      });

    // If there is an error during download
    if (error) {
      console.error("Supabase upload error:", error.message);
      return NextResponse.json(
        { status: "fail", error: error.message },
        { status: 500 }
      );
    }

    // Return a successful response from the file URL
    return NextResponse.json({
      status: "success",
      fileUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Error in file upload:", error.message);
    return NextResponse.json(
      { status: "fail", error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const filePath = formData.get("filePath"); // Path to an existing file
    const userId = formData.get("userId"); // id of the user whose photo is being updated
    if (!file || !filePath) {
      throw new Error("File and filePath are required");
    }
    // Getting the path to the old photo from the database
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { photo: true }, // Get only photo field
    });
    const fileUrl = user.photo;

    // Trim part of the URL to get only the path to the file in the bucket
    const fileOldPath = fileUrl
      .replace("blob:https://", "blob:https:/") // Remove the extra "/"
      .split("supabase.co/storage/v1/object/public/uploads")[1] // Extract the part after "uploads/"
      ?.replace(/^\/+/, ""); //Remove extra slashes at the beginning
    // Delete previous file
    const { dataDelete, deleteError } = await supabase.storage
      .from("uploads")
      .remove([fileOldPath]);

    if (deleteError) {
      console.error("Error deleting old file:", deleteError.message);
    } else {
      console.log("Old file deleted successfully!");
    }

    // Upload the file, allowing overwriting
    const { data, error } = await supabase.storage
      .from("uploads") // Name of bucket
      .upload(filePath, file, {
        cacheControl: "3600", // Set caching
        upsert: true, // If a file with that name already exists, overwrite it.
      });

    // If there is an error during download
    if (error) {
      console.error("Supabase upload error:", error.message);
      return NextResponse.json(
        { status: "fail", error: error.message },
        { status: 500 }
      );
    }
    // Return a successful response from the file URL
    return NextResponse.json({
      status: "success",
      fileUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    });
  } catch (error) {
    console.error("Error in file upload:", error.message);
    return NextResponse.json(
      { status: "fail", error: error.message },
      { status: 500 }
    );
  }
}
// ------Uploading a file to the storage in Wasabi---------//
// import {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import prisma from "@/lib/prisma";

// const s3 = new S3Client({
//   endpoint: process.env.WASABI_ENDPOINT, // Wasabi endpoint
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.WASABI_ACCESS_KEY,
//     secretAccessKey: process.env.WASABI_SECRET_KEY,
//   },
// });

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");

//     if (!file) {
//       throw new Error("No file uploaded");
//     }

//     const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
//     const fileBuffer = Buffer.from(await file.arrayBuffer());

//     const uploadParams = {
//       Bucket: process.env.WASABI_BUCKET_NAME,
//       Key: fileName,
//       Body: fileBuffer,
//       ContentType: file.type,
//     };

//     try {
//       const response = await s3.send(new PutObjectCommand(uploadParams));

//       // Generate the correct URL for the file
//       const fileUrl = `https://s3.us-east-1.wasabisys.com/${process.env.WASABI_BUCKET_NAME}/${fileName}`;

//       return NextResponse.json({ status: "success", fileUrl });
//     } catch (error) {
//       console.error("Upload error:", error);
//       return NextResponse.json(
//         { status: "fail", error: error.message },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error uploading file:", error.message);
//     return NextResponse.json(
//       { status: "fail", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // 🔹 UPDATE FILE (PUT)

// export async function PUT(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");
//     const userId = formData.get("userId");

//     if (!file || !userId) {
//       throw new Error("File and userId are required");
//     }

//     // Get old URL
//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//       select: { photo: true },
//     });

//     if (!user) throw new Error("User not found");

//     const isPlaceholder = user.photo === "/image-placeholder.svg";

//     // If the photo is not a placeholder, delete it from Wasabi
//     if (user.photo && !isPlaceholder) {
//       const oldFileKey = user.photo.split("/").pop();

//       if (oldFileKey) {
//         const deleteParams = {
//           Bucket: process.env.WASABI_BUCKET_NAME,
//           Key: oldFileKey,
//         };

//         try {
//           await s3.send(new DeleteObjectCommand(deleteParams));
//         } catch (deleteError) {
//           console.warn("Failed to delete old file:", deleteError.message);
//         }
//       }
//     }

//     // Generating a new name
//     const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
//     const fileBuffer = Buffer.from(await file.arrayBuffer());

//     // Uploading a new photo
//     const uploadParams = {
//       Bucket: process.env.WASABI_BUCKET_NAME,
//       Key: fileName,
//       Body: fileBuffer,
//       ContentType: file.type,
//     };

//     await s3.send(new PutObjectCommand(uploadParams));

//     // Forming a URL to a new photo
//     const fileUrl = `https://s3.us-east-1.wasabisys.com/${process.env.WASABI_BUCKET_NAME}/${fileName}`;

//     // Оновлюємо в базі
//     await prisma.user.update({
//       where: { id: Number(userId) },
//       data: { photo: fileUrl },
//     });

//     return NextResponse.json({ status: "success", fileUrl });
//   } catch (error) {
//     console.error("Error updating file:", error.message);
//     return NextResponse.json(
//       { status: "fail", error: error.message },
//       { status: 500 }
//     );
//   }
// }
