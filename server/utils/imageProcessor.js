const sharp = require("sharp");
const path = require("path");
const os = require("os");

/**
 * Optimizes an image and saves it with a 16:9 aspect ratio
 * @param {Buffer} imageBuffer - The original image buffer
 * @param {string} filename - Original filename
 * @returns {Promise<{optimizedBuffer: Buffer, originalBuffer: Buffer}>}
 */
async function optimizeImage(imageBuffer, filename) {
  try {
    // Create a temporary file path
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `optimized_${filename}`);

    // Process the image
    const optimizedBuffer = await sharp(imageBuffer)
      .resize({
        width: 640, // Reduced from 1280 to 640
        height: 360, // Reduced from 720 to 360 (maintaining 16:9 ratio)
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 }) // Compress with good quality
      .toBuffer();

    return {
      optimizedBuffer,
      originalBuffer: imageBuffer,
    };
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw new Error("Failed to optimize image");
  }
}

module.exports = {
  optimizeImage,
};
