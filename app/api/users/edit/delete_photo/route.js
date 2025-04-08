import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Initializing the S3 client for Wasabi
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
    const { photoUrl } = await req.json();

    // If no photo is sent, return an error.
    if (!photoUrl) {
      return NextResponse.json(
        { message: "No photo URL provided" },
        { status: 400 }
      );
    }

    // Clean up the URL to get only the path to the file in the bucket
    const fileKey = photoUrl.split("/").pop(); // отримуємо назву файлу з URL

    if (!fileKey) {
      return NextResponse.json(
        { message: "Invalid photo URL" },
        { status: 400 }
      );
    }

    // Options for deleting a file from Wasabi
    const deleteParams = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: fileKey,
    };

    // Deleting a file from Wasabi
    await s3.send(new DeleteObjectCommand(deleteParams));

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting photo:", error.message);
    return NextResponse.json(
      { message: "Failed to delete file", error: error.message },
      { status: 500 }
    );
  }
}
