import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WhatsAppButton from "@/components/WhatsAppButton";

describe("WhatsAppButton", () => {
  it("renders a link with aria-label for accessibility", () => {
    render(<WhatsAppButton />);
    const link = screen.getByLabelText("Contactar por WhatsApp");
    expect(link).toBeInTheDocument();
  });

  it("points to wa.me with correct WhatsApp number", () => {
    render(<WhatsAppButton />);
    const link = screen.getByLabelText("Contactar por WhatsApp");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/525567916346")
    );
  });

  it("opens in a new tab", () => {
    render(<WhatsAppButton />);
    const link = screen.getByLabelText("Contactar por WhatsApp");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("has a fixed position class for FAB positioning", () => {
    render(<WhatsAppButton />);
    const link = screen.getByLabelText("Contactar por WhatsApp");
    expect(link.className).toContain("fixed");
  });
});
