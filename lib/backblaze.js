import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  accessKeyId: process.env.BACKBLAZE_KEY_ID,
  secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY,
  signatureVersion: "v4",
});

export async function uploadFile(fileBuffer, fileName, fileType) {
  const params = {
    Bucket: process.env.BACKBLAZE_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,
    ACL: "public-read", // or 'private'
  };

  const upload = await s3.upload(params).promise();
  return upload.Location; // returns the file URL
}
