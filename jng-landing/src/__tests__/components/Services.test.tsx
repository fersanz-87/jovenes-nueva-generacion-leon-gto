import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "@/components/Services";

vi.mock("@/components/ui/CloudinaryImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="services-img" />,
}));

describe("Services", () => {
  it("renders the section heading", () => {
    render(<Services />);
    expect(
      screen.getByRole("heading", { name: /Nuestros Servicios/i })
    ).toBeInTheDocument();
  });

  it("renders all 6 services", () => {
    render(<Services />);
    const serviceNames = [
      "Consejero en Adicciones",
      "Doctor",
      "Psicólogo",
      "INAEBA",
      "Terapias Espirituales",
      "Espacios para Recreación Física",
    ];
    for (const name of serviceNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders both section images", () => {
    render(<Services />);
    const images = screen.getAllByTestId("services-img");
    expect(images).toHaveLength(2);
  });

  it("has the correct section id", () => {
    const { container } = render(<Services />);
    expect(container.querySelector("#servicios")).toBeInTheDocument();
  });
});
