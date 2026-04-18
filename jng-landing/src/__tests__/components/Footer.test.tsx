import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the brand name", () => {
    render(<Footer />);
    expect(
      screen.getByText("Jóvenes Nueva Generación A.C.")
    ).toBeInTheDocument();
  });

  it("renders CEPAAV description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/CEPAAV — Centro Especializado Para las Adicciones/i)
    ).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Un Lugar Para Renacer y Aprender a Vivir/i)
    ).toBeInTheDocument();
  });

  it("renders phone contact links", () => {
    render(<Footer />);
    const phoneLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("tel:"));
    expect(phoneLinks.length).toBeGreaterThanOrEqual(3);
  });

  it("renders the email link", () => {
    render(<Footer />);
    const emailLink = screen.getByRole("link", {
      name: /jn_generacion@hotmail.com/i,
    });
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:jn_generacion@hotmail.com"
    );
  });

  it("renders a WhatsApp link", () => {
    render(<Footer />);
    const waLink = screen.getByRole("link", { name: /WhatsApp/i });
    expect(waLink).toHaveAttribute("target", "_blank");
    expect(waLink).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me")
    );
  });

  it("renders the address", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Calle Tzulá #124, Col. Los Castillos/i)
    ).toBeInTheDocument();
  });

  it("renders visiting hours", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Domingos 12:00 PM - 6:00 PM/i)
    ).toBeInTheDocument();
  });

  it("displays the current year in copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${year}`))
    ).toBeInTheDocument();
  });

  it("renders the developer credit link", () => {
    render(<Footer />);
    const devLink = screen.getByRole("link", { name: /Fer Sanz Dev/i });
    expect(devLink).toHaveAttribute("href", "https://www.fersanz.dev");
    expect(devLink).toHaveAttribute("target", "_blank");
  });
});
