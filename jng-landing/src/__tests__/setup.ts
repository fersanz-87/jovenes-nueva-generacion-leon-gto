import "@testing-library/jest-dom/vitest";

const env = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "test-cloud",
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "test-preset",
};

for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value;
}
