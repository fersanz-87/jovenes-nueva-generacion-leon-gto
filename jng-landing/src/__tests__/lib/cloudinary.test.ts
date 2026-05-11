import { describe, it, expect } from "vitest";
import {
  HERO_MEDIA,
  ABOUT_MEDIA,
  SERVICES_MEDIA,
  CAIPRA_MEDIA,
  TESTIMONIALS_MEDIA,
  GENERAL_MEDIA,
} from "@/lib/cloudinary";

describe("cloudinary media configuration", () => {
  it("HERO_MEDIA has a backgroundImage", () => {
    expect(HERO_MEDIA.backgroundImage).toBeDefined();
    expect(typeof HERO_MEDIA.backgroundImage).toBe("string");
    expect(HERO_MEDIA.backgroundImage.length).toBeGreaterThan(0);
  });

  it("ABOUT_MEDIA has sectionImage and sectionVideos with id and title", () => {
    expect(ABOUT_MEDIA.sectionImage).toBeDefined();
    expect(ABOUT_MEDIA.sectionVideos).toBeDefined();
    expect(ABOUT_MEDIA.sectionVideos.length).toBeGreaterThan(0);
    for (const video of ABOUT_MEDIA.sectionVideos) {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
    }
  });

  it("SERVICES_MEDIA has sectionImages and sectionVideo", () => {
    expect(SERVICES_MEDIA.sectionImages).toBeDefined();
    expect(SERVICES_MEDIA.sectionImages).toHaveLength(2);
    expect(SERVICES_MEDIA.sectionVideo).toBeDefined();
  });

  it("CAIPRA_MEDIA has sectionVideo", () => {
    expect(CAIPRA_MEDIA.sectionVideo).toBeDefined();
    expect(CAIPRA_MEDIA.sectionVideo).toBe("about-video-4");
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
