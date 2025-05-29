import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import type { UploadApiResponse, UploadApiOptions, DeleteApiResponse } from 'cloudinary';

export function uploadFile(
  filePath: string,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> {
  return cloudinary.uploader.upload(filePath, options);
}

export function getSecureUrl(publicId: string, options: Record<string, unknown> = {}): string {
  return cloudinary.url(publicId, { secure: true, ...options });
}

export function deleteFile(publicId: string): Promise<DeleteApiResponse> {
  return cloudinary.uploader.destroy(publicId);
}
