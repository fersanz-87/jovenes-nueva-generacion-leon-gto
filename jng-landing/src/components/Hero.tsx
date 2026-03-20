"use client";

import { Phone, MessageCircle, Shield } from "lucide-react";
import { HERO_MEDIA } from "@/lib/cloudinary";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import CloudinaryVideo from "@/components/ui/CloudinaryVideo";

export default function Hero() {
  const hasVideo = !!HERO_MEDIA.backgroundVideo;
  const hasImage = !!HERO_MEDIA.backgroundImage;

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* Background layers */}
      {hasVideo || hasImage ? (
        <>
          {/* Poster image as immediate background */}
          {hasImage && (
            <div className="absolute inset-0 z-0">
              <CloudinaryImage
                publicId={HERO_MEDIA.backgroundImage}
                alt="Centro de rehabilitación Jóvenes Nueva Generación"
                fill
                sizes="100vw"
                className="object-cover"
                priority
                fallback={
                  <div className="h-full w-full bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700" />
                }
              />
            </div>
          )}

          {/* Video layer */}
          {hasVideo && (
            <div className="absolute inset-0 z-[1]">
              <CloudinaryVideo
                publicId={HERO_MEDIA.backgroundVideo}
                width={1920}
                height={1080}
                autoPlay
                loop
                controls={false}
                className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
              />
            </div>
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 z-[2] bg-primary-900/60" />
        </>
      ) : (
        <>
          {/* Original gradient fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydi0ySDE0djJoMjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
            <Shield className="h-4 w-4 text-accent-400" />
            Ayuda 24/7 | Vigilancia 24/7
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Jóvenes Nueva Generación
          </h1>
          <p className="mb-2 text-lg font-medium text-accent-400 sm:text-xl">
            CEPAAV — Centro Especializado Para las Adicciones
          </p>
          <p className="mb-8 text-xl italic text-primary-100 sm:text-2xl">
            &ldquo;Un Lugar Para Renacer y Aprender a Vivir&rdquo;
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100">
            Centro de rehabilitación profesional en León, Guanajuato. Contamos con un
            equipo multidisciplinario de especialistas para ayudarte en tu proceso de
            recuperación.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/527202655475?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20el%20centro%20de%20rehabilitaci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-secondary-600 hover:shadow-xl sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
            <a
              href="#contacto"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-primary-600 sm:w-auto"
            >
              <Phone className="h-5 w-5" />
              Contáctanos
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-accent-400">24/7</p>
              <p className="text-sm text-primary-100">Disponibilidad</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-accent-400">13+</p>
              <p className="text-sm text-primary-100">Servicios especializados</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-accent-400">Equipo</p>
              <p className="text-sm text-primary-100">Multidisciplinario</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
