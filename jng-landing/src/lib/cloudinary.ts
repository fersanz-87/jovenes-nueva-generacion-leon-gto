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
export interface AboutVideo {
  readonly id: string;
  readonly title: string;
}

export const ABOUT_MEDIA = {
  sectionImage: "about-main",
  sectionVideos: [
    { id: "about-video",   title: "Información General" },
    { id: "about-video-2", title: "Junta espiritual todos los días Jueves" },
    { id: "about-video-3", title: "Convivio femenil 1 día a la semana" },
  ],
} as const satisfies {
  sectionImage: string;
  sectionVideos: readonly AboutVideo[];
};

// Services Section
export const SERVICES_MEDIA = {
  sectionImage: "services-main",
  sectionVideo: "jng/services/services-video",
} as const;

// CAIPRA Section
export const CAIPRA_MEDIA = {
  sectionVideo: "about-video-4",
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
