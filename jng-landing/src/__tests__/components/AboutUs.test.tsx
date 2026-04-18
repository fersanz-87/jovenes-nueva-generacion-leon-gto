import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutUs from "@/components/AboutUs";

vi.mock("@/components/ui/CloudinaryImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="about-img" />,
}));

vi.mock("@/components/ui/CloudinaryVideo", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="about-video" className={className} />
  ),
}));

describe("AboutUs", () => {
  it('renders the "Sobre Nosotros" heading', () => {
    render(<AboutUs />);
    expect(
      screen.getByRole("heading", { name: /Sobre Nosotros/i })
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<AboutUs />);
    expect(
      screen.getByText(/CEPAAV es un centro de rehabilitación profesional/i)
    ).toBeInTheDocument();
  });

  it("renders all 4 pillar cards", () => {
    render(<AboutUs />);
    const pillarTitles = [
      "Bienestar Integral",
      "Equipo Multidisciplinario",
      "Desarrollo Personal",
      "Especialistas Certificados",
    ];
    for (const title of pillarTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders the section image", () => {
    render(<AboutUs />);
    expect(screen.getByTestId("about-img")).toBeInTheDocument();
  });

  it("renders the section video", () => {
    render(<AboutUs />);
    expect(screen.getByTestId("about-video")).toBeInTheDocument();
  });

  it("has the correct section id for navigation", () => {
    const { container } = render(<AboutUs />);
    const section = container.querySelector("#nosotros");
    expect(section).toBeInTheDocument();
  });
});
