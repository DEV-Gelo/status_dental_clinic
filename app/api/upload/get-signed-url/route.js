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
  // Якщо fileKey містить домен, ми просто видаляємо його
  const baseUrl = "https://s3.us-east-1.wasabisys.com/dentapro/";
  if (fileKey && fileKey.startsWith(baseUrl)) {
    fileKey = fileKey.slice(baseUrl.length); // Видаляємо домен
  }
  if (fileKey.startsWith("/")) {
    fileKey = fileKey.slice(1);
  }

  console.log("FileKey :", fileKey);
  if (!fileKey) {
    return new Response("Missing key", { status: 400 });
  }

  // Декодуємо fileKey, щоб забезпечити правильне кодування
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
