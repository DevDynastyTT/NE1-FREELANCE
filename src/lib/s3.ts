import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = "ne1-freelance";

const s3Client = new S3({
  region: "eu-west-1",
  endpoint: process.env.SECRET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY_ID!,
  },
  forcePathStyle: true,
});

export async function getImageUrl(fileName: string): Promise<string> {
  if (!fileName) return "";

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error: unknown) {
    console.error("Error generating pre-signed URL:", error instanceof Error ? error.message : 'Unknown error');
    return fileName;
  }
}

export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType?: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    console.log("File uploaded successfully:", fileName);
    return fileName;
  } catch (error: unknown) {
    console.error("Error uploading to S3:", error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
