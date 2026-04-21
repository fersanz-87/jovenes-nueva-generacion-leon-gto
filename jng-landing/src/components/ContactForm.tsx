"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { ContactFormResponse } from "@/types";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
    _honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    try {
      // Read CSRF token from cookie for double-submit pattern
      const csrfToken = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrf-token="))
        ?.split("=")[1] ?? "";

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data: ContactFormResponse = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message);
        setFormData({ nombre: "", telefono: "", email: "", mensaje: "", _honeypot: "" });
      } else {
        setStatus("error");
        setMessage(data.message || "Hubo un error al enviar el mensaje.");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo más tarde.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-secondary-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-secondary-500" />
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          ¡Mensaje enviado!
        </h3>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-primary-500 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot - hidden from users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="_honeypot">No llenar este campo</label>
        <input
          type="text"
          id="_honeypot"
          name="_honeypot"
          value={formData._honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
          Nombre *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-gray-700">
          Teléfono *
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          required
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: 477 123 4567"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
        />
        {errors.telefono && (
          <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email <span className="text-gray-400">(opcional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-gray-700">
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={4}
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="¿En qué podemos ayudarte?"
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
        />
        {errors.mensaje && (
          <p className="mt-1 text-sm text-red-500">{errors.mensaje}</p>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}
