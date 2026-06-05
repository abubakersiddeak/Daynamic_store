import axios from "axios";

interface UploadResponse {
  data: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is not defined");
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", apiKey);

  try {
    const response = await axios.post<UploadResponse>(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
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
