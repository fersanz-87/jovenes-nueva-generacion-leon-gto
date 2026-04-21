import { describe, it, expect } from "vitest";
import { contactSchema, sanitizeEmailHeader } from "@/lib/validations";

describe("contactSchema", () => {
  const validData = {
    nombre: "Juan Pérez",
    telefono: "477 123 4567",
    email: "juan@example.com",
    mensaje: "Me gustaría recibir más información sobre el centro.",
  };

  it("accepts valid complete data", () => {
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts data without email (optional field)", () => {
    const { email: _, ...noEmail } = validData;
    const result = contactSchema.safeParse(noEmail);
    expect(result.success).toBe(true);
  });

  it("accepts empty string for email", () => {
    const result = contactSchema.safeParse({ ...validData, email: "" });
    expect(result.success).toBe(true);
  });

  it("accepts honeypot as empty string", () => {
    const result = contactSchema.safeParse({
      ...validData,
      _honeypot: "",
    });
    expect(result.success).toBe(true);
  });

  describe("nombre validation", () => {
    it("rejects name shorter than 2 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        nombre: "A",
      });
      expect(result.success).toBe(false);
    });

    it("rejects name longer than 100 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        nombre: "A".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      const result = contactSchema.safeParse({
        ...validData,
        nombre: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("telefono validation", () => {
    it("accepts phone with spaces and dashes", () => {
      const result = contactSchema.safeParse({
        ...validData,
        telefono: "+52 (477) 123-4567",
      });
      expect(result.success).toBe(true);
    });

    it("rejects phone shorter than 7 digits", () => {
      const result = contactSchema.safeParse({
        ...validData,
        telefono: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("rejects phone with letters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        telefono: "477abc1234",
      });
      expect(result.success).toBe(false);
    });

    it("rejects phone longer than 20 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        telefono: "1".repeat(21),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("rejects invalid email format", () => {
      const result = contactSchema.safeParse({
        ...validData,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("mensaje validation", () => {
    it("rejects message shorter than 10 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        mensaje: "Hola",
      });
      expect(result.success).toBe(false);
    });

    it("rejects message longer than 1000 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        mensaje: "A".repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("_honeypot validation", () => {
    it("rejects honeypot with content (bot detection)", () => {
      const result = contactSchema.safeParse({
        ...validData,
        _honeypot: "spam content",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("sanitizeEmailHeader", () => {
  it("passes through clean strings", () => {
    expect(sanitizeEmailHeader("Hello World")).toBe("Hello World");
  });

  it("strips carriage return and newline", () => {
    expect(sanitizeEmailHeader("line1\r\nBcc: evil@hacker.com")).toBe(
      "line1Bcc: evil@hacker.com"
    );
  });

  it("strips lone \\r and \\n", () => {
    expect(sanitizeEmailHeader("a\rb\nc")).toBe("abc");
  });

  it("strips control characters (null byte, tab, etc.)", () => {
    expect(sanitizeEmailHeader("hello\x00\x01\x1fworld")).toBe("helloworld");
  });

  it("strips DEL character (0x7f)", () => {
    expect(sanitizeEmailHeader("test\x7fvalue")).toBe("testvalue");
  });

  it("trims whitespace", () => {
    expect(sanitizeEmailHeader("  spaced  ")).toBe("spaced");
  });

  it("handles empty string", () => {
    expect(sanitizeEmailHeader("")).toBe("");
  });
});
