import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Caipra from "@/components/Caipra";

vi.mock("@/components/ui/CloudinaryImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="caipra-img" />,
}));

describe("Caipra", () => {
  it("renders the CAIPRA heading", () => {
    render(<Caipra />);
    expect(
      screen.getByRole("heading", { name: /CAIPRA/i })
    ).toBeInTheDocument();
  });

  it("renders the femenil subtitle", () => {
    render(<Caipra />);
    expect(
      screen.getByText(/Clínica de Rehabilitación Femenil/i)
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Caipra />);
    expect(
      screen.getByText(/sección especializada para mujeres/i)
    ).toBeInTheDocument();
  });

  it("renders all 3 phone links", () => {
    render(<Caipra />);
    const phoneLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("href")?.startsWith("tel:")
    );
    expect(phoneLinks).toHaveLength(3);
  });

  it("renders the address", () => {
    render(<Caipra />);
    expect(
      screen.getByText(/Calle Tzulá #124, Col. Los Castillos/i)
    ).toBeInTheDocument();
  });

  it("has the correct section id", () => {
    const { container } = render(<Caipra />);
    expect(container.querySelector("#caipra")).toBeInTheDocument();
  });
});
