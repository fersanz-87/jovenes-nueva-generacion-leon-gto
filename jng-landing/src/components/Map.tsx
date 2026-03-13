import { MapPin, Clock, Phone, Mail } from "lucide-react";
import ContactForm from "./ContactForm";

export default function Map() {
  return (
    <>
      <section id="contacto" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-700 sm:text-4xl">
              Contáctanos
            </h2>
            <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-accent-400" />
            <p className="mb-12 text-lg text-gray-600">
              Estamos aquí para ayudarte. Envíanos un mensaje o llámanos directamente.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900">Teléfonos</p>
                    <a href="tel:+524779302775" className="text-gray-600 hover:text-primary-500">
                      477 930 2775
                    </a>
                    <br />
                    <a href="tel:+527202655475" className="text-gray-600 hover:text-primary-500">
                      720 265 5475
                    </a>
                    <br />
                    <a href="tel:+524772631485" className="text-gray-600 hover:text-primary-500">
                      477 263 1485
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:jn_generacion@hotmail.com"
                      className="text-gray-600 hover:text-primary-500"
                    >
                      jn_generacion@hotmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900">Dirección</p>
                    <p className="text-gray-600">
                      Calle Tzulá #124, Col. Los Castillos
                      <br />
                      León, Guanajuato, México
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900">Horario de Visitas</p>
                    <p className="text-gray-600">Domingos de 12:00 PM a 6:00 PM</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm font-medium text-primary-500">
                Contacto principal: Daniel López García
              </p>
            </div>

            {/* Contact Form */}
            <div className="relative">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section id="ubicacion" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-700 sm:text-4xl">
              Ubicación
            </h2>
            <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-accent-400" />
          </div>

          <div className="overflow-hidden rounded-2xl shadow-lg">
            <iframe
              title="Ubicación de Jóvenes Nueva Generación en León, Guanajuato"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.8!2d-101.68!3d21.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCalle+Tzul%C3%A1+124%2C+Los+Castillos%2C+Le%C3%B3n%2C+Gto.!5e0!3m2!1ses!2smx!4v1"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-center text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-500" />
              <span>Calle Tzulá #124, Col. Los Castillos, León, Guanajuato, México</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-500" />
              <span>Horario de visitas: Domingos de 12:00 PM a 6:00 PM</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
