import { Phone, Heart, Shield } from "lucide-react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { CAIPRA_MEDIA } from "@/lib/cloudinary";

const telefonos = [
  { numero: "477 705 9608", href: "tel:+524777059608" },
  { numero: "477 630 0533", href: "tel:+524776300533" },
  { numero: "477 449 1551", href: "tel:+524774491551" },
];

export default function Caipra() {
  return (
    <section id="caipra" className="bg-linear-to-br from-primary-50 to-secondary-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-12">
            {/* Section image */}
            <CloudinaryImage
              publicId={CAIPRA_MEDIA.sectionImage}
              alt="Sección femenil CAIPRA"
              width={800}
              height={400}
              className="mb-8 w-full rounded-2xl object-cover"
              sizes="(max-width: 896px) 100vw, 800px"
              fallback={null}
            />

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                <Heart className="h-6 w-6 text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-primary-700 sm:text-4xl">
                CAIPRA
              </h2>
            </div>

            <p className="mb-2 text-center text-lg font-medium text-gray-700">
              Clínica de Rehabilitación Femenil
            </p>
            <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-pink-400" />

            <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600 leading-relaxed">
              Contamos con una sección especializada para mujeres, brindando un espacio
              seguro y profesional para su proceso de recuperación. El mismo equipo
              multidisciplinario de CEPAAV atiende esta sección, garantizando la misma
              calidad de servicio.
            </p>

            <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Misma dirección: Calle Tzulá #124, Col. Los Castillos</span>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {telefonos.map((tel) => (
                <a
                  key={tel.numero}
                  href={tel.href}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-pink-200 bg-pink-50 px-6 py-3 font-medium text-pink-700 transition-all hover:bg-pink-500 hover:text-white hover:border-pink-500 sm:w-auto"
                >
                  <Phone className="h-4 w-4" />
                  {tel.numero}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
