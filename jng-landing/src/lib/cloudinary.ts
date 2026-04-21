/**
 * Centralized Cloudinary media configuration.
 *
 * All public IDs for images and videos served from Cloudinary are defined here.
 * To replace an asset, update the corresponding public ID string.
 *
 * Folder convention in Cloudinary:
 *   jng/hero/...
 *   jng/about/...
 *   jng/services/...
 *   jng/caipra/...
 *   jng/testimonials/...
 *   jng/general/...
 */

// Hero Section
export const HERO_MEDIA = {
  backgroundImage: "hero-background",
} as const;

// About Us Section
export const ABOUT_MEDIA = {
  sectionImage: "about-main",
  sectionVideo: "about-video",
} as const;

// Services Section
export const SERVICES_MEDIA = {
  sectionImage: "services-main",
  sectionVideo: "jng/services/services-video",
} as const;

// CAIPRA Section
export const CAIPRA_MEDIA = {
  sectionImage: "caipra-main",
  sectionVideo: "jng/caipra/caipra-video",
} as const;

// Testimonials Section
export const TESTIMONIALS_MEDIA = {
  avatars: {
    carlosM: "jng/testimonials/avatar-carlos",
    mariaL: "jng/testimonials/avatar-maria",
    robertoG: "jng/testimonials/avatar-roberto",
    anaP: "jng/testimonials/avatar-ana",
  },
} as const;

// General / Shared
export const GENERAL_MEDIA = {
  logo: "logo",
  ogImage: "jng/general/og-image",
} as const;
