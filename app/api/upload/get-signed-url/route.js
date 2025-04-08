import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let fileKey = searchParams.get("key");

  const baseUrl = "https://dentapro.s3.us-east-1.wasabisys.com/";

  // If fileKey contains a domain, remove it
  if (fileKey && fileKey.startsWith(baseUrl)) {
    fileKey = fileKey.replace(baseUrl, ""); // Видаляємо домен
  }

  // Check if fileKey exists and remove extra slashes
  if (fileKey.startsWith("/")) {
    fileKey = fileKey.slice(1);
  }

  if (!fileKey) {
    return new Response("Missing key", { status: 400 });
  }

  // Decode the fileKey to ensure correct encoding
  fileKey = decodeURIComponent(fileKey);

  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 хвилин

    return Response.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new Response("Failed to generate URL", { status: 500 });
  }
}
