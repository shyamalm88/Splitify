const { admin } = require("../config/firebase");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

/**
 * Upload file to Firebase Storage
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} originalFilename - Original filename from the client
 * @param {string} folder - Folder to store the file in (e.g., 'group-images', 'profile-pictures')
 * @returns {Promise<string>} - URL of the uploaded file
 */
const uploadToFirebaseStorage = async (
  fileBuffer,
  originalFilename,
  folder = "uploads"
) => {
  try {
    if (!fileBuffer) {
      throw new Error("File buffer is required");
    }

    // Create a temporary file
    const tempFilePath = path.join(
      os.tmpdir(),
      originalFilename || `temp-${Date.now()}`
    );
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Generate a unique filename
    const extension = path.extname(originalFilename || ".jpg");
    const uniqueFilename = `${uuidv4()}${extension}`;
    const storagePath = `${folder}/${uniqueFilename}`;

    // Upload the file to Firebase Storage
    const bucket = admin.storage().bucket();
    await bucket.upload(tempFilePath, {
      destination: storagePath,
      metadata: {
        contentType: getContentType(extension),
        metadata: {
          originalFilename,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Make the file publicly accessible
    const file = bucket.file(storagePath);
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Helper function to determine content type based on file extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
const getContentType = (extension) => {
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
};

/**
 * Convert a Base64 string to a Buffer
 * @param {string} base64String - The Base64 string to convert
 * @returns {Buffer} - The Buffer representation
 */
const base64ToBuffer = (base64String) => {
  if (!base64String) return null;

  // If it's a data URL, extract the Base64 part
  const base64Data = base64String.split(";base64,").pop();
  return Buffer.from(base64Data, "base64");
};

/**
 * Upload a Base64 encoded image to Firebase Storage
 * @param {string} base64Image - Base64 encoded image
 * @param {string} folder - Folder to store the image in
 * @returns {Promise<string>} - URL of the uploaded image
 */
const uploadBase64Image = async (base64Image, folder = "uploads") => {
  if (!base64Image) {
    throw new Error("Base64 image is required");
  }

  // Determine file extension from MIME type
  let extension = ".jpg"; // Default
  if (base64Image.startsWith("data:image/png;")) {
    extension = ".png";
  } else if (base64Image.startsWith("data:image/gif;")) {
    extension = ".gif";
  } else if (base64Image.startsWith("data:image/webp;")) {
    extension = ".webp";
  }

  const buffer = base64ToBuffer(base64Image);
  const uniqueFilename = `image-${Date.now()}`;
  return await uploadToFirebaseStorage(
    buffer,
    uniqueFilename + extension,
    folder
  );
};

module.exports = {
  uploadToFirebaseStorage,
  base64ToBuffer,
  uploadBase64Image,
};
