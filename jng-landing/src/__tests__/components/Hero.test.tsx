import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

vi.mock("@/components/ui/CloudinaryImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="hero-bg" />,
}));

describe("Hero", () => {
  it("renders the main heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Jóvenes Nueva Generación/i })
    ).toBeInTheDocument();
  });

  it("renders CEPAAV subtitle", () => {
    render(<Hero />);
    expect(
      screen.getByText(/CEPAAV — Centro Especializado Para las Adicciones/i)
    ).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Un Lugar Para Renacer y Aprender a Vivir/i)
    ).toBeInTheDocument();
  });

  it("renders a WhatsApp CTA link", () => {
    render(<Hero />);
    const whatsappLink = screen.getByRole("link", { name: /WhatsApp/i });
    expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders a Contáctanos link pointing to #contacto", () => {
    render(<Hero />);
    const contactLink = screen.getByRole("link", { name: /Contáctanos/i });
    expect(contactLink).toHaveAttribute("href", "#contacto");
  });

  it("renders the 24/7 badge", () => {
    render(<Hero />);
    expect(screen.getByText(/Ayuda 24\/7/i)).toBeInTheDocument();
  });

  it("renders the hero background image", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-bg")).toBeInTheDocument();
  });
});
