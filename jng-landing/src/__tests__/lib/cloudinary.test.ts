import { describe, it, expect } from "vitest";
import {
  CLOUDINARY_UPLOAD_FOLDER,
  HERO_MEDIA,
  ABOUT_MEDIA,
  SERVICES_MEDIA,
  CAIPRA_MEDIA,
  TESTIMONIALS_MEDIA,
  GENERAL_MEDIA,
} from "@/lib/cloudinary";

describe("cloudinary media configuration", () => {
  it("CLOUDINARY_UPLOAD_FOLDER is defined", () => {
    expect(CLOUDINARY_UPLOAD_FOLDER).toBe("jng/uploads");
  });

  it("HERO_MEDIA has a backgroundImage", () => {
    expect(HERO_MEDIA.backgroundImage).toBeDefined();
    expect(typeof HERO_MEDIA.backgroundImage).toBe("string");
    expect(HERO_MEDIA.backgroundImage.length).toBeGreaterThan(0);
  });

  it("ABOUT_MEDIA has sectionImage and sectionVideo", () => {
    expect(ABOUT_MEDIA.sectionImage).toBeDefined();
    expect(ABOUT_MEDIA.sectionVideo).toBeDefined();
  });

  it("SERVICES_MEDIA has sectionImage and sectionVideo", () => {
    expect(SERVICES_MEDIA.sectionImage).toBeDefined();
    expect(SERVICES_MEDIA.sectionVideo).toBeDefined();
  });

  it("CAIPRA_MEDIA has sectionImage and sectionVideo", () => {
    expect(CAIPRA_MEDIA.sectionImage).toBeDefined();
    expect(CAIPRA_MEDIA.sectionVideo).toBeDefined();
  });

  it("TESTIMONIALS_MEDIA has avatar entries", () => {
    const avatars = TESTIMONIALS_MEDIA.avatars;
    expect(Object.keys(avatars).length).toBeGreaterThan(0);
    for (const key of Object.keys(avatars)) {
      expect(
        avatars[key as keyof typeof avatars].length
      ).toBeGreaterThan(0);
    }
  });

  it("GENERAL_MEDIA has logo and ogImage", () => {
    expect(GENERAL_MEDIA.logo).toBeDefined();
    expect(GENERAL_MEDIA.ogImage).toBeDefined();
  });
});
