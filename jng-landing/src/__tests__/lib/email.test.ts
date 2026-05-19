import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.fn();

vi.mock("resend", () => {
  class MockResend {
    emails = { send: mockSend };
  }
  return { Resend: MockResend };
});

const validPayload = {
  nombre: "Juan Pérez",
  telefono: "477 123 4567",
  email: "juan@test.com",
  mensaje: "Me gustaría recibir información sobre el centro.",
};

describe("sendContactEmail", () => {
  let sendContactEmail: typeof import("@/lib/email").sendContactEmail;

  beforeEach(async () => {
    mockSend.mockReset();
    process.env.EMAIL_TO = "admin@test.com";
    process.env.RESEND_FROM = "JNG <noreply@test.com>";
    process.env.RESEND_API_KEY = "re_test_123";

    vi.resetModules();
    const mod = await import("@/lib/email");
    sendContactEmail = mod.sendContactEmail;
  });

  it("sends email via Resend when API key is set", async () => {
    mockSend.mockResolvedValueOnce({ data: { id: "msg_123" }, error: null });

    await sendContactEmail(validPayload);

    expect(mockSend).toHaveBeenCalledOnce();
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "JNG <noreply@test.com>",
        to: "admin@test.com",
        subject: "Nuevo contacto: Juan Pérez",
        replyTo: "juan@test.com",
      })
    );
  });

  it("includes text body with contact details", async () => {
    mockSend.mockResolvedValueOnce({ data: { id: "msg_123" }, error: null });

    await sendContactEmail(validPayload);

    const callArgs = mockSend.mock.calls[0][0] as { text: string };
    expect(callArgs.text).toContain("Nombre: Juan Pérez");
    expect(callArgs.text).toContain("Teléfono: 477 123 4567");
    expect(callArgs.text).toContain("Email: juan@test.com");
    expect(callArgs.text).toContain(validPayload.mensaje);
  });

  it("omits replyTo when email is empty", async () => {
    mockSend.mockResolvedValueOnce({ data: { id: "msg_123" }, error: null });

    await sendContactEmail({ ...validPayload, email: "" });

    const callArgs = mockSend.mock.calls[0][0] as { replyTo?: string };
    expect(callArgs.replyTo).toBeUndefined();
  });

  it("throws when Resend returns an error", async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { name: "validation_error", message: "Invalid from address" },
    });

    await expect(sendContactEmail(validPayload)).rejects.toThrow(
      "Email delivery failed"
    );
  });

  it("logs instead of sending when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    const mod = await import("@/lib/email");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await mod.sendContactEmail(validPayload);

    expect(mockSend).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[email] RESEND_API_KEY not set, logging instead:",
      expect.objectContaining({ to: "admin@test.com" })
    );
    consoleSpy.mockRestore();
  });

  it("throws when EMAIL_TO is not set", async () => {
    delete process.env.EMAIL_TO;
    vi.resetModules();
    const mod = await import("@/lib/email");

    await expect(mod.sendContactEmail(validPayload)).rejects.toThrow(
      "EMAIL_TO environment variable is not set."
    );
  });

  it("throws when RESEND_FROM is not set", async () => {
    delete process.env.RESEND_FROM;
    vi.resetModules();
    const mod = await import("@/lib/email");

    await expect(mod.sendContactEmail(validPayload)).rejects.toThrow(
      "RESEND_FROM environment variable is not set."
    );
  });
});
