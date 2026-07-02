import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

const getExtension = (mime: string): string => {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
};

const getS3Config = () => {
  const region = process.env.APP_AWS_REGION;
  const accessKeyId = process.env.APP_AWS_ACCESS_KEY;
  const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.APP_AWS_S3_BUCKET;

  if (!region || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return { region, accessKeyId, secretAccessKey, bucket };
};

export const POST = async (request: Request) => {
  const config = getS3Config();
  if (!config) {
    return NextResponse.json(
      {
        error:
          "S3 upload is not configured. Set APP_AWS_REGION, APP_AWS_ACCESS_KEY, APP_AWS_SECRET_ACCESS_KEY, and APP_AWS_S3_BUCKET.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field is required" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only jpg, png, gif, and webp images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 10MB or smaller" }, { status: 400 });
  }

  const ext = getExtension(file.type);
  const key = `siheomform/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  const url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;

  return NextResponse.json({ url });
};
