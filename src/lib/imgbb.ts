interface UploadResponse {
  url?: string;
  error?: string;
}

export async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as UploadResponse;

    if (!response.ok || !payload.url) {
      throw new Error(payload.error || "Image upload failed");
    }

    return payload.url;
  } catch (error) {
    console.error("ImgBB upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImageToImgBB(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
}
