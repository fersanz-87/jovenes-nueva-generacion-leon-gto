import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutUs from "@/components/AboutUs";

vi.mock("@/components/ui/CloudinaryImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="about-img" />,
}));

vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "test-cloud");

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

  it("renders all section videos with titles", () => {
    const { container } = render(<AboutUs />);
    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(3);
    expect(screen.getByText("Información General")).toBeInTheDocument();
    expect(screen.getByText("Junta espiritual todos los días Jueves")).toBeInTheDocument();
    expect(screen.getByText("Convivio femenil 1 día a la semana")).toBeInTheDocument();
  });

  it("has the correct section id for navigation", () => {
    const { container } = render(<AboutUs />);
    const section = container.querySelector("#nosotros");
    expect(section).toBeInTheDocument();
  });
});
