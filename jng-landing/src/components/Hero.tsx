import { Phone, MessageCircle, Shield } from "lucide-react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { HERO_MEDIA } from "@/lib/cloudinary";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 bg-white">
        <div className="relative h-full w-full translate-y-[8%]">
          <CloudinaryImage
            publicId={HERO_MEDIA.backgroundImage}
            alt="Centro de rehabilitación Jóvenes Nueva Generación"
            fill
            sizes="100vw"
            className="object-contain"
            priority
            fallback={
              <div className="h-full w-full bg-linear-to-br from-primary-600 via-primary-500 to-primary-700" />
            }
          />
        </div>
      </div>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-1 bg-primary-900/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
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

          <div className="mt-100 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </div>
      </div>
    </section>
  );
}
