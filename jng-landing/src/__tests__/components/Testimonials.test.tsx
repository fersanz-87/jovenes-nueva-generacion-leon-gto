import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Testimonials from "@/components/Testimonials";

describe("Testimonials", () => {
  it("renders the section heading", () => {
    render(<Testimonials />);
    expect(
      screen.getByRole("heading", { name: /Testimonios/i })
    ).toBeInTheDocument();
  });

  it("renders the intro paragraph", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/Historias de esperanza y transformación/i)
    ).toBeInTheDocument();
  });

  it("renders all 4 testimonials", () => {
    render(<Testimonials />);
    const names = ["Carlos M.", "María L.", "Roberto G.", "Ana P."];
    for (const name of names) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders the recovery time for each testimonial", () => {
    render(<Testimonials />);
    expect(screen.getByText("2 años en recuperación")).toBeInTheDocument();
    expect(screen.getByText("1 año en recuperación")).toBeInTheDocument();
    expect(screen.getByText("Familiar de paciente")).toBeInTheDocument();
    expect(screen.getByText("3 años en recuperación")).toBeInTheDocument();
  });

  it("renders avatar initials for each person", () => {
    render(<Testimonials />);
    const avatars = screen.getAllByText(/^[A-Z]$/);
    expect(avatars.length).toBe(4);
  });

  it("renders the privacy disclaimer", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/Los nombres han sido cambiados/i)
    ).toBeInTheDocument();
  });

  it("has the correct section id", () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelector("#testimonios")).toBeInTheDocument();
  });
});
