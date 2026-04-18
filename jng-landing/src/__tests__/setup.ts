import "@testing-library/jest-dom/vitest";

const env = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "test-cloud",
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "test-preset",
  CLOUDINARY_API_KEY: "test-api-key",
  CLOUDINARY_API_SECRET: "test-api-secret",
};

for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value;
}
