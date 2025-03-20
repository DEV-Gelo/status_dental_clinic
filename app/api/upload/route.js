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
    console.log("File Path :", fileOldPath);
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
      fileUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    });
  } catch (error) {
    console.error("Error in file upload:", error.message);
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
