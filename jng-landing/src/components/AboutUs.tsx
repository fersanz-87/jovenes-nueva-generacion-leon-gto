import { Heart, Users, Brain, ShieldCheck } from "lucide-react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import CloudinaryVideo from "@/components/ui/CloudinaryVideo";
import { ABOUT_MEDIA } from "@/lib/cloudinary";

const pilares = [
  {
    icono: Heart,
    titulo: "Bienestar Integral",
    descripcion:
      "Atención enfocada en las áreas física, mental, emocional y social del paciente.",
  },
  {
    icono: Users,
    titulo: "Equipo Multidisciplinario",
    descripcion:
      "Doctor, psicólogos, INAEBA, terapias espirituales y consejeros en adicciones.",
  },
  {
    icono: Brain,
    titulo: "Desarrollo Personal",
    descripcion:
      "Programas diseñados para la restructuración integral de la vida del paciente.",
  },
  {
    icono: ShieldCheck,
    titulo: "Especialistas Certificados",
    descripcion:
      "Equipo de profesionales certificados con experiencia en el tratamiento de adicciones.",
  },
];

export default function AboutUs() {
  const hasImage = !!ABOUT_MEDIA.sectionImage;
  const hasVideo = !!ABOUT_MEDIA.sectionVideo;

  return (
    <section id="nosotros" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-700 sm:text-4xl">
            Sobre Nosotros
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-accent-400" />
        </div>

        <div
          className={
            hasImage
              ? "grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
              : "mx-auto max-w-3xl text-center"
          }
        >
          {hasImage && (
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
              <CloudinaryImage
                publicId={ABOUT_MEDIA.sectionImage}
                alt="Instalaciones de Jóvenes Nueva Generación"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                crop="fill"
                gravity="north"
              />
            </div>
          )}
          <div>
            <p className="mb-6 text-lg text-gray-600 leading-relaxed">
              CEPAAV es un centro de rehabilitación profesional que cuenta con
              un equipo multidisciplinario de consejeros en adicciones, doctor,
              psicólogo, INAEBA, terapias espirituales, asi como una alberca y
              espacios para recreación física. Todo esto para que el paciente
              reestructure su vida en las áreas física, mental, emocional y
              social que se vieron afectadas por su enfermedad.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Los servicios ofrecidos están orientados al desarrollo personal,
              profesional y bienestar integral. Contamos con un equipo de
              especialistas certificados y programas diseñados para ofrecer
              apoyo efectivo en el proceso de recuperación.
            </p>
          </div>
        </div>

        {hasVideo && (
          <div className="mt-12">
            <h3 className="mb-6 text-center text-xl font-semibold text-gray-800">
              Conoce más acerca de nuestro centro de rehabilitación!
            </h3>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-lg">
              <CloudinaryVideo
                publicId={ABOUT_MEDIA.sectionVideo}
                width={1280}
                height={720}
                autoPlay
                loop
                controls
                className="aspect-video w-full"
                fallback={
                  <div className="flex aspect-video items-center justify-center bg-gray-200 text-gray-500">
                    Video no disponible
                  </div>
                }
              />
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((pilar) => (
            <div
              key={pilar.titulo}
              className="rounded-2xl bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                <pilar.icono className="h-7 w-7 text-primary-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {pilar.titulo}
              </h3>
              <p className="text-sm text-gray-600">{pilar.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
