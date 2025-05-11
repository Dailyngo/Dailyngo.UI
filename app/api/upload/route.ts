import { NextRequest, NextResponse } from "next/server";
import { S3Service } from "@/services/s3/s3Service";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const s3Service = new S3Service();
    const result = await s3Service.uploadFile(buffer, file.type);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key");
    const contentType = searchParams.get("contentType") || "application/octet-stream";

    if (!key) {
      return NextResponse.json({ error: "No key provided" }, { status: 400 });
    }

    const s3Service = new S3Service();
    const result = await s3Service.getFileUrl(key);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in presigned URL route:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
} 