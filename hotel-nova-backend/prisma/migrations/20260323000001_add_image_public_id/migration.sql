-- AlterTable: store the Cloudinary public_id alongside the secure_url
-- This is required so we can call cloudinary.uploader.destroy() on room deletion
ALTER TABLE "rooms" ADD COLUMN "imagePublicId" TEXT;
