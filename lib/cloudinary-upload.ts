import crypto from "crypto";

export async function uploadToCloudinary(file: Blob) {
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY!);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Cloudinary upload failed: " + text);
  }

  return res.json(); // { secure_url, public_id, ... }
}
