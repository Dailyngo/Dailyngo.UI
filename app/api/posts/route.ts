import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ImageService } from "@/services/image/imageService";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    if (!content && !image) {
      return NextResponse.json(
        { error: "Content or image is required" },
        { status: 400 }
      );
    }

    let imageKey: string | null = null;

    // Process and upload image if provided
    if (image) {
      const imageService = new ImageService();
      const buffer = Buffer.from(await image.arrayBuffer());
      imageKey = await imageService.processAndUploadImage(buffer, image.name);
    }

    // Create post with content and imageKey
    const postData = {
      content,
      imageKey,
      userId: token.sub, // Assuming token.sub contains the user ID
    };

    // Here you would typically save the post to your database
    // For example:
    // const post = await prisma.post.create({
    //   data: postData
    // });

    return NextResponse.json({
      success: true,
      data: postData
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
} 