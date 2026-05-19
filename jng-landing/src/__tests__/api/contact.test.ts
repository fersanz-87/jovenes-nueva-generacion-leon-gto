import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { _resetStore } from "@/lib/rate-limit";

vi.mock("@/lib/validations", async () => {
  const actual = await vi.importActual<typeof import("@/lib/validations")>(
    "@/lib/validations"
  );
  return actual;
});

const mockSendContactEmail = vi.fn();
vi.mock("@/lib/email", () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...args),
}));

const originalFetch = globalThis.fetch;

async function callContactRoute(body: unknown) {
  const { POST } = await import("@/app/api/contact/route");
  const request = new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return POST(request);
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    _resetStore();
    mockSendContactEmail.mockReset();
    mockSendContactEmail.mockResolvedValue(undefined);
    // Turnstile secret not set by default — verification is skipped
    delete process.env.TURNSTILE_SECRET_KEY;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns success for valid data", async () => {
    const res = await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "477 123 4567",
      email: "juan@test.com",
      mensaje: "Me gustaría recibir información sobre el centro.",
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.message).toContain("Gracias");
  });

  it("calls sendContactEmail with sanitized data", async () => {
    await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "477 123 4567",
      email: "juan@test.com",
      mensaje: "Me gustaría recibir información sobre el centro.",
    });

    expect(mockSendContactEmail).toHaveBeenCalledOnce();
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Juan Pérez",
        telefono: "477 123 4567",
        email: "juan@test.com",
      })
    );
  });

  it("returns success for valid data without email", async () => {
    const res = await callContactRoute({
      nombre: "María López",
      telefono: "555 987 6543",
      mensaje: "Necesito información sobre los programas disponibles.",
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("silently accepts honeypot submissions (returns fake success)", async () => {
    const res = await callContactRoute({
      nombre: "Bot",
      telefono: "000 000 0000",
      mensaje: "Spam message from a bot.",
      _honeypot: "I am a bot",
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    // Email should NOT be sent for honeypot
    expect(mockSendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for missing required fields", async () => {
    const res = await callContactRoute({
      nombre: "Juan",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 400 for short nombre", async () => {
    const res = await callContactRoute({
      nombre: "A",
      telefono: "477 123 4567",
      mensaje: "Mensaje de prueba con suficientes caracteres.",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 400 for invalid phone format", async () => {
    const res = await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "abc",
      mensaje: "Mensaje de prueba con suficientes caracteres.",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 400 for short mensaje", async () => {
    const res = await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "477 123 4567",
      mensaje: "Hola",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 500 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{",
    });
    const res = await POST(request);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("sanitizes HTML in input fields", async () => {
    await callContactRoute({
      nombre: '<script>alert("xss")</script>Juan',
      telefono: "477 123 4567",
      mensaje: 'Mensaje con <b>HTML</b> y "comillas" & ampersand',
    });

    expect(mockSendContactEmail).toHaveBeenCalledOnce();
    const payload = mockSendContactEmail.mock.calls[0][0] as Record<
      string,
      string
    >;
    expect(payload.nombre).not.toContain("<script>");
    expect(payload.nombre).toContain("&lt;script&gt;");
    expect(payload.mensaje).not.toContain("<b>");
    expect(payload.mensaje).toContain("&lt;b&gt;");
  });

  it("returns 500 when email service fails", async () => {
    mockSendContactEmail.mockRejectedValueOnce(
      new Error("Email delivery failed")
    );

    const res = await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "477 123 4567",
      mensaje: "Mensaje de prueba con suficientes caracteres.",
    });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    // Generic message — no error leak
    expect(json.message).not.toContain("Email delivery");
  });

  it("returns 400 when Turnstile verification fails", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("challenges.cloudflare.com")) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: false, "error-codes": ["invalid-input-response"] }),
        });
      }
      return originalFetch(url);
    }) as typeof fetch;

    const res = await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "477 123 4567",
      mensaje: "Mensaje de prueba con suficientes caracteres.",
      "cf-turnstile-response": "bad-token",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("No pudimos verificar tu solicitud.");
    expect(mockSendContactEmail).not.toHaveBeenCalled();
  });

  it("processes form when Turnstile verification succeeds", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("challenges.cloudflare.com")) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        });
      }
      return originalFetch(url);
    }) as typeof fetch;

    const res = await callContactRoute({
      nombre: "Juan Pérez",
      telefono: "477 123 4567",
      mensaje: "Mensaje de prueba con suficientes caracteres.",
      "cf-turnstile-response": "valid-token",
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockSendContactEmail).toHaveBeenCalledOnce();
  });
});
