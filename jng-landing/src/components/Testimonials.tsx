import { Quote } from "lucide-react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { TESTIMONIALS_MEDIA } from "@/lib/cloudinary";

const testimonios = [
  {
    nombre: "Carlos M.",
    texto:
      "Llegué al centro sin esperanza, pero el equipo de profesionales me ayudó a reconstruir mi vida. Hoy tengo 2 años limpio y una relación restaurada con mi familia. Estaré eternamente agradecido.",
    tiempo: "2 años en recuperación",
    avatarId: TESTIMONIALS_MEDIA.avatars.carlosM,
  },
  {
    nombre: "María L.",
    texto:
      "La sección femenil CAIPRA me brindó un espacio seguro donde pude trabajar en mi recuperación. Las terapias grupales y el apoyo del psicólogo fueron fundamentales para mi proceso.",
    tiempo: "1 año en recuperación",
    avatarId: TESTIMONIALS_MEDIA.avatars.mariaL,
  },
  {
    nombre: "Roberto G.",
    texto:
      "La terapia familiar cambió la dinámica de mi hogar. Mi hijo recibió la atención que necesitaba y nosotros aprendimos a ser un verdadero apoyo para él. Recomiendo ampliamente este centro.",
    tiempo: "Familiar de paciente",
    avatarId: TESTIMONIALS_MEDIA.avatars.robertoG,
  },
  {
    nombre: "Ana P.",
    texto:
      "El programa integral que ofrecen realmente marca la diferencia. Desde la atención médica hasta los talleres de desarrollo humano, cada aspecto está diseñado para ayudarte a salir adelante.",
    tiempo: "3 años en recuperación",
    avatarId: TESTIMONIALS_MEDIA.avatars.anaP,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-700 sm:text-4xl">
            Testimonios
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-accent-400" />
          <p className="mb-12 text-lg text-gray-600">
            Historias de esperanza y transformación de quienes han pasado por nuestro
            centro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.nombre}
              className="relative rounded-2xl bg-white p-8 shadow-md"
            >
              <Quote className="mb-4 h-8 w-8 text-primary-200" />
              <p className="mb-6 text-gray-600 leading-relaxed italic">
                &ldquo;{testimonio.texto}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <CloudinaryImage
                  publicId={testimonio.avatarId}
                  alt={testimonio.nombre}
                  width={40}
                  height={40}
                  crop="fill"
                  gravity="face"
                  className="h-10 w-10 rounded-full object-cover"
                  fallback={
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                      {testimonio.nombre.charAt(0)}
                    </div>
                  }
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonio.nombre}</p>
                  <p className="text-sm text-gray-500">{testimonio.tiempo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm italic text-gray-400">
          * Los nombres han sido cambiados para proteger la privacidad de los pacientes.
          Los testimonios son representativos de experiencias reales.
        </p>
      </div>
    </section>
  );
}
