import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /Enviar Mensaje/i })
    ).toBeInTheDocument();
  });

  it("has a hidden honeypot field", () => {
    render(<ContactForm />);
    const honeypot = screen.getByLabelText(/No llenar este campo/i);
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });

  it("updates field values on user input", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nombreInput = screen.getByLabelText(/Nombre/i);
    await user.type(nombreInput, "Juan Pérez");
    expect(nombreInput).toHaveValue("Juan Pérez");

    const telefonoInput = screen.getByLabelText(/Teléfono/i);
    await user.type(telefonoInput, "4771234567");
    expect(telefonoInput).toHaveValue("4771234567");

    const mensajeInput = screen.getByLabelText(/Mensaje/i);
    await user.type(mensajeInput, "Necesito información");
    expect(mensajeInput).toHaveValue("Necesito información");
  });

  it("shows success state after successful submission", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "¡Gracias por contactarnos!",
      }),
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nombre/i), "Juan");
    await user.type(screen.getByLabelText(/Teléfono/i), "4771234567");
    await user.type(
      screen.getByLabelText(/Mensaje/i),
      "Información del centro por favor"
    );

    await user.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(screen.getByText(/¡Mensaje enviado!/i)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/¡Gracias por contactarnos!/i)
    ).toBeInTheDocument();
  });

  it("shows error state on failed submission", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: "Datos inválidos.",
      }),
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nombre/i), "Juan");
    await user.type(screen.getByLabelText(/Teléfono/i), "4771234567");
    await user.type(
      screen.getByLabelText(/Mensaje/i),
      "Información del centro por favor"
    );

    await user.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(screen.getByText(/Datos inválidos/i)).toBeInTheDocument();
    });
  });

  it("shows network error message when fetch throws", async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nombre/i), "Juan");
    await user.type(screen.getByLabelText(/Teléfono/i), "4771234567");
    await user.type(
      screen.getByLabelText(/Mensaje/i),
      "Información del centro por favor"
    );

    await user.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Error de conexión/i)
      ).toBeInTheDocument();
    });
  });

  it('allows sending another message via "Enviar otro mensaje" link', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Gracias",
      }),
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nombre/i), "Juan");
    await user.type(screen.getByLabelText(/Teléfono/i), "4771234567");
    await user.type(
      screen.getByLabelText(/Mensaje/i),
      "Información del centro por favor"
    );

    await user.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(screen.getByText(/¡Mensaje enviado!/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Enviar otro mensaje/i));

    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue("");
  });

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: unknown) => void;
    mockFetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nombre/i), "Juan");
    await user.type(screen.getByLabelText(/Teléfono/i), "4771234567");
    await user.type(
      screen.getByLabelText(/Mensaje/i),
      "Información del centro por favor"
    );

    await user.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    expect(screen.getByText(/Enviando.../i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();

    resolveFetch!({
      ok: true,
      json: async () => ({ success: true, message: "OK" }),
    });

    await waitFor(() => {
      expect(screen.getByText(/¡Mensaje enviado!/i)).toBeInTheDocument();
    });
  });

  it("sends form data to /api/contact via POST", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "OK" }),
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nombre/i), "María");
    await user.type(screen.getByLabelText(/Teléfono/i), "5551234567");
    await user.type(screen.getByLabelText(/Email/i), "maria@test.com");
    await user.type(
      screen.getByLabelText(/Mensaje/i),
      "Quiero más información"
    );

    await user.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": "" },
      body: JSON.stringify({
        nombre: "María",
        telefono: "5551234567",
        email: "maria@test.com",
        mensaje: "Quiero más información",
        _honeypot: "",
      }),
    });
  });
});
