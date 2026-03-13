export interface ContactFormData {
  nombre: string;
  telefono: string;
  email?: string;
  mensaje: string;
  _honeypot?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export interface Servicio {
  nombre: string;
  icono: string;
}

export interface Testimonio {
  nombre: string;
  texto: string;
  tiempo: string;
}
