import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Map from "@/components/Map";

vi.mock("@/components/ContactForm", () => ({
  default: () => <div data-testid="contact-form-mock">ContactForm</div>,
}));

describe("Map", () => {
  it("renders the Contáctanos heading", () => {
    render(<Map />);
    expect(
      screen.getByRole("heading", { name: /Contáctanos/i })
    ).toBeInTheDocument();
  });

  it("renders the Ubicación heading", () => {
    render(<Map />);
    expect(
      screen.getByRole("heading", { name: /Ubicación/i })
    ).toBeInTheDocument();
  });

  it("renders contact info: phone numbers", () => {
    render(<Map />);
    expect(screen.getByText("477 930 2775")).toBeInTheDocument();
    expect(screen.getByText("720 265 5475")).toBeInTheDocument();
    expect(screen.getByText("477 263 1485")).toBeInTheDocument();
  });

  it("renders the email address", () => {
    render(<Map />);
    expect(
      screen.getByText("jn_generacion@hotmail.com")
    ).toBeInTheDocument();
  });

  it("renders the physical address", () => {
    render(<Map />);
    const addressElements = screen.getAllByText(
      /Calle Tzulá #124, Col. Los Castillos/i
    );
    expect(addressElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders visiting hours", () => {
    render(<Map />);
    const hoursElements = screen.getAllByText(
      /Domingos de 12:00 PM a 6:00 PM/i
    );
    expect(hoursElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the contact form", () => {
    render(<Map />);
    expect(screen.getByTestId("contact-form-mock")).toBeInTheDocument();
  });

  it("embeds a Google Maps iframe", () => {
    render(<Map />);
    const iframe = screen.getByTitle(
      /Ubicación de Jóvenes Nueva Generación/i
    );
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe.getAttribute("src")).toContain("google.com/maps");
  });

  it("has correct section ids for navigation", () => {
    const { container } = render(<Map />);
    expect(container.querySelector("#contacto")).toBeInTheDocument();
    expect(container.querySelector("#ubicacion")).toBeInTheDocument();
  });

  it("renders contact person name", () => {
    render(<Map />);
    expect(
      screen.getByText(/Daniel López García/i)
    ).toBeInTheDocument();
  });
});
