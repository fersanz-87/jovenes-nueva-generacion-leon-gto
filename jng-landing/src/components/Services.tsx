import {
  HandHeart,
  Stethoscope,
  Brain,
  GraduationCap,
  Sparkles,
  Dumbbell,
} from "lucide-react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { SERVICES_MEDIA } from "@/lib/cloudinary";

const servicios = [
  { nombre: "Consejero en Adicciones", icono: HandHeart },
  { nombre: "Doctor", icono: Stethoscope },
  { nombre: "Psicólogo", icono: Brain },
  { nombre: "INAEBA", icono: GraduationCap },
  { nombre: "Terapias Espirituales", icono: Sparkles },
  { nombre: "Espacios para Recreación Física", icono: Dumbbell },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-700 sm:text-4xl">
            Nuestros Servicios
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-accent-400" />
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Services list */}
          <div className="space-y-4">
            {servicios.map((servicio) => (
              <div
                key={servicio.nombre}
                className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 transition-colors group-hover:bg-primary-500">
                  <servicio.icono className="h-6 w-6 text-primary-500 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {servicio.nombre}
                </h3>
              </div>
            ))}
          </div>

          {/* Section image */}
          <div className="flex items-center justify-center">
            <CloudinaryImage
              publicId={SERVICES_MEDIA.sectionImage}
              alt="Instalaciones y servicios del centro"
              width={600}
              height={700}
              crop="fill"
              gravity="north"
              className="w-full rounded-2xl object-cover shadow-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
              fallback={null}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
