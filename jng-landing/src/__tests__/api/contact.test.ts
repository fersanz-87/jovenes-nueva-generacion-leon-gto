import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/validations", async () => {
  const actual = await vi.importActual<typeof import("@/lib/validations")>(
    "@/lib/validations"
  );
  return actual;
});

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
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
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
    consoleSpy.mockClear();

    const res = await callContactRoute({
      nombre: '<script>alert("xss")</script>Juan',
      telefono: "477 123 4567",
      mensaje: 'Mensaje con <b>HTML</b> y "comillas" & ampersand',
    });

    expect(res.status).toBe(200);

    const logCall = consoleSpy.mock.calls.find(
      (call) => call[0] === "Nuevo contacto recibido:"
    );
    expect(logCall).toBeDefined();

    const loggedData = logCall![1] as Record<string, string>;
    expect(loggedData.nombre).not.toContain("<script>");
    expect(loggedData.nombre).toContain("&lt;script&gt;");
    expect(loggedData.mensaje).not.toContain("<b>");
    expect(loggedData.mensaje).toContain("&lt;b&gt;");
  });
});
