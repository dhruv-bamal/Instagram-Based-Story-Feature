export interface Story {
  /** Stable unique id (crypto.randomUUID). */
  id: string;
  /** Compressed JPEG image as a base64 data URL. */
  image: string;
  /** Epoch ms when the story was uploaded. */
  createdAt: number;
  /** Epoch ms when the story expires (createdAt + STORY_TTL_MS). */
  expiresAt: number;
  /** Whether the story has been opened in the viewer. */
  seen: boolean;
}

/** A story lives for 24 hours after upload. */
export const STORY_TTL_MS = 24 * 60 * 60 * 1000;

/** localStorage key (versioned so the shape can evolve safely). */
export const STORAGE_KEY = "stories:v1";

/** Max stored image dimensions, per project constraints. */
export const MAX_IMAGE_WIDTH = 1080;
export const MAX_IMAGE_HEIGHT = 1920;
