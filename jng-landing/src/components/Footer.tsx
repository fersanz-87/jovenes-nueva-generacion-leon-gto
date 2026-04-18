import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/contact";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-700 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-2 text-xl font-bold">Jóvenes Nueva Generación A.C.</h3>
            <p className="mb-1 text-sm text-primary-200">
              CEPAAV — Centro Especializado Para las Adicciones
            </p>
            <p className="text-sm italic text-primary-300">
              &ldquo;Un Lugar Para Renacer y Aprender a Vivir&rdquo;
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-300">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-300" />
                <a href="tel:+524779302775" className="hover:text-accent-400 transition-colors">
                  477 930 2775
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-300" />
                <a href="tel:+527202655475" className="hover:text-accent-400 transition-colors">
                  720 265 5475
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-300" />
                <a href="tel:+524772631485" className="hover:text-accent-400 transition-colors">
                  477 263 1485
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-300" />
                <a
                  href="mailto:jn_generacion@hotmail.com"
                  className="hover:text-accent-400 transition-colors"
                >
                  jn_generacion@hotmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary-300" />
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-300">
              Ubicación
            </h4>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
              <p>
                Calle Tzulá #124, Col. Los Castillos
                <br />
                León, Guanajuato, México
              </p>
            </div>
            <p className="mt-3 text-sm text-primary-200">
              Horario de visitas: Domingos 12:00 PM - 6:00 PM
            </p>
            <p className="mt-1 text-sm font-medium text-accent-400">
              Ayuda 24/7 | Vigilancia 24/7
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-600 pt-6 text-center text-sm text-primary-300">
          <p>
            &copy; {currentYear} Jóvenes Nueva Generación A.C. Todos los derechos
            reservados.
          </p>
          <p className="mt-2">
            Desarrollado por{" "}
            <a
              href="https://www.fersanz.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-300 transition-colors"
            >
              Fer Sanz Dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
