import { MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from "@/types/story";

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

/**
 * Read an image file, downscale it to fit within MAX_IMAGE_WIDTH x
 * MAX_IMAGE_HEIGHT (preserving aspect ratio), and return a compressed JPEG
 * base64 data URL suitable for localStorage.
 */
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new ImageProcessingError("Please choose an image file."));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const { width, height } = img;
        if (!width || !height) {
          throw new ImageProcessingError("That image couldn't be read.");
        }

        // Scale down only — never upscale (cap at 1).
        const scale = Math.min(
          1,
          MAX_IMAGE_WIDTH / width,
          MAX_IMAGE_HEIGHT / height,
        );
        const targetW = Math.round(width * scale);
        const targetH = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new ImageProcessingError("Canvas isn't supported here.");
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      } catch (err) {
        reject(
          err instanceof Error
            ? err
            : new ImageProcessingError("Failed to process the image."),
        );
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageProcessingError("That image couldn't be loaded."));
    };

    img.src = url;
  });
}
