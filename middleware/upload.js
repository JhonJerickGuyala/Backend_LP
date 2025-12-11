// server/middleware/upload.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// CONFIGURATION 1: AMENITIES (Existing)
// ==========================================
const amenitiesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'la_piscina_amenities', // Dito mapupunta ang amenities images
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const uploadAmenities = multer({ storage: amenitiesStorage });


// ==========================================
// CONFIGURATION 2: PROOF OF PAYMENT (New)
// ==========================================
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'la_piscina_payments', // Dito mapupunta ang proof of payments (Gagawin kusa ni Cloudinary ang folder na ito)
    allowed_formats: ['jpg', 'png', 'jpeg'], // Siguro alisin na ang webp para sa resibo, pero nasa sayo
  },
});

export const uploadPayment = multer({ storage: paymentStorage });