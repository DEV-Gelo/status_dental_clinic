import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "https://s3.wasabisys.com", // Wasabi endpoint
  region: "us-east-1", // Регін для Wasabi
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
  forcePathStyle: true, // Використовуємо path style для S3
  useAccelerateEndpoint: false, // Вимкнення акселерації
  disableHostPrefix: true, // Вимкнення префіксів у хостах
});

async function checkConnection() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.WASABI_BUCKET_NAME,
    });

    const response = await s3.send(command);
    console.log("Connection successful. Objects in bucket:", response.Contents);
    return response;
  } catch (error) {
    console.error("Error connecting to Wasabi:", error.message);
    throw error;
  }
}

checkConnection();
