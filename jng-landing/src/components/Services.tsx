import {
  HandHeart,
  Stethoscope,
  Brain,
  Users,
  Heart,
  Sparkles,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Apple,
  BrainCircuit,
  Waves,
  TreePine,
} from "lucide-react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import CloudinaryVideo from "@/components/ui/CloudinaryVideo";
import { SERVICES_MEDIA } from "@/lib/cloudinary";

const servicios = [
  { nombre: "Consejero en Adicciones", icono: HandHeart },
  { nombre: "Doctor", icono: Stethoscope },
  { nombre: "Psicólogo", icono: Brain },
  { nombre: "Terapia Grupal", icono: Users },
  { nombre: "Terapia Familiar", icono: Heart },
  { nombre: "Terapia Espiritual", icono: Sparkles },
  { nombre: "Terapia Física", icono: Dumbbell },
  { nombre: "Talleres de Desarrollo Humano", icono: BookOpen },
  { nombre: "INAEBA (Educación)", icono: GraduationCap },
  { nombre: "Nutriólogo", icono: Apple },
  { nombre: "Psiquiatra", icono: BrainCircuit },
  { nombre: "Alberca (Piscina)", icono: Waves },
  { nombre: "Espacios de Recreación", icono: TreePine },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-700 sm:text-4xl">
            Nuestros Servicios
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-accent-400" />
          <p className="mb-12 text-lg text-gray-600">
            Ofrecemos un programa integral de rehabilitación con más de 13 servicios
            especializados para apoyar tu proceso de recuperación.
          </p>
        </div>

        {/* Section image banner */}
        <CloudinaryImage
          publicId={SERVICES_MEDIA.sectionImage}
          alt="Instalaciones y servicios del centro"
          width={1200}
          height={400}
          className="mb-12 w-full rounded-2xl object-cover shadow-lg"
          sizes="(max-width: 1280px) 100vw, 1200px"
          fallback={null}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {servicios.map((servicio) => (
            <div
              key={servicio.nombre}
              className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 transition-colors group-hover:bg-primary-500">
                <servicio.icono className="h-6 w-6 text-primary-500 transition-colors group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{servicio.nombre}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-primary-50 p-8 text-center">
          <h3 className="mb-3 text-xl font-semibold text-primary-700">
            Terapia Familiar
          </h3>
          <p className="mx-auto max-w-2xl text-gray-600">
            La finalidad de la terapia familiar es lograr que el apoyo de los familiares
            sea efectivo, ayudándoles a eliminar los obstáculos que entorpecen su
            comunicación con el paciente y así poder expresarse abierta y libremente.
          </p>
        </div>

        {/* Section video */}
        <CloudinaryVideo
          publicId={SERVICES_MEDIA.sectionVideo}
          width={1200}
          height={675}
          autoPlay={false}
          loop={false}
          controls
          className="mt-12 overflow-hidden rounded-2xl shadow-lg"
          fallback={null}
        />
      </div>
    </section>
  );
}
