import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Caipra from "@/components/Caipra";

vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "test-cloud");

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

  it("renders a video element instead of an image", () => {
    const { container } = render(<Caipra />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders exactly 2 phone links with correct labels", () => {
    render(<Caipra />);
    const phoneLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("href")?.startsWith("tel:")
    );
    expect(phoneLinks).toHaveLength(2);
    expect(screen.getByText("477 930 2775")).toBeInTheDocument();
    expect(screen.getByText("720 265 5475")).toBeInTheDocument();
    expect(screen.getByText("Oficina")).toBeInTheDocument();
    expect(screen.getByText("Móvil")).toBeInTheDocument();
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
