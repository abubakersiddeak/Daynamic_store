import { requireAdmin } from "@/lib/admin-auth";

interface ImgBBUploadResponse {
  data?: {
    url?: string;
  };
  success?: boolean;
  error?: {
    message?: string;
  };
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Image upload is not configured." },
        { status: 500 },
      );
    }

    const requestFormData = await request.formData();
    const image = requestFormData.get("image");

    if (!(image instanceof File)) {
      return Response.json({ error: "Image file is required." }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", image);
    uploadFormData.append("key", apiKey);

    const uploadResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: uploadFormData,
    });

    const payload = (await uploadResponse.json()) as ImgBBUploadResponse;

    if (!uploadResponse.ok || !payload.success || !payload.data?.url) {
      return Response.json(
        { error: payload.error?.message || "Image upload failed." },
        { status: uploadResponse.status || 502 },
      );
    }

    return Response.json({ url: payload.data.url });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Upload route error:", error);
    return Response.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
