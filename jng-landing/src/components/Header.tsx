"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#caipra", label: "CAIPRA" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
  { href: "#ubicacion", label: "Ubicación" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#inicio" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-500">JNG</span>
            <span className="hidden text-sm text-gray-600 sm:inline">
              Jóvenes Nueva Generación
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-500"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+524779302775"
              className="flex items-center gap-1 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              <Phone className="h-4 w-4" />
              Llamar
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-gray-700 md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-500"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+524779302775"
              className="mx-4 mt-2 flex items-center justify-center gap-1 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white"
            >
              <Phone className="h-4 w-4" />
              Llamar ahora
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
