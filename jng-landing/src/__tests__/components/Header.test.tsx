import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";

vi.mock("@/components/ui/CloudinaryImage", () => ({
  default: ({ alt, fallback }: { alt: string; fallback?: React.ReactNode }) =>
    fallback ? <>{fallback}</> : <img alt={alt} />,
}));

describe("Header", () => {
  it("renders the brand name", () => {
    render(<Header />);
    expect(
      screen.getByText("Jóvenes Nueva Generación")
    ).toBeInTheDocument();
  });

  it("renders all navigation links in desktop nav", () => {
    render(<Header />);
    const expectedLinks = [
      "Inicio",
      "Nosotros",
      "Servicios",
      "CAIPRA",
      "Testimonios",
      "Contacto",
      "Ubicación",
    ];
    for (const label of expectedLinks) {
      const links = screen.getAllByText(label);
      expect(links.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders a call-to-action phone link", () => {
    render(<Header />);
    const llamarLinks = screen.getAllByText(/Llamar/);
    expect(llamarLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByLabelText("Abrir menú");
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByLabelText("Cerrar menú")).toBeInTheDocument();
  });

  it("closes mobile menu when a nav link is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("Abrir menú"));

    const mobileLinks = screen
      .getAllByText("Servicios")
      .filter(
        (el) => el.closest(".md\\:hidden") !== null
      );

    if (mobileLinks.length > 0) {
      await user.click(mobileLinks[0]);
    }

    expect(screen.getByLabelText("Abrir menú")).toBeInTheDocument();
  });
});
