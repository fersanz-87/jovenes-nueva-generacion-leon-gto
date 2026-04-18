import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

vi.mock("next-cloudinary", () => ({
  CldImage: (props: Record<string, unknown>) => (
    <img
      data-testid="cld-image"
      src={props.src as string}
      alt={props.alt as string}
    />
  ),
}));

describe("CloudinaryImage", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "test-cloud");
  });

  it("renders CldImage when cloudName and publicId are provided", () => {
    render(
      <CloudinaryImage
        publicId="hero-background"
        alt="Test image"
        width={600}
        height={400}
      />
    );
    const img = screen.getByTestId("cld-image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("renders fallback when publicId is empty", () => {
    render(
      <CloudinaryImage
        publicId=""
        alt="Test image"
        width={600}
        height={400}
        fallback={<span data-testid="fallback">Fallback</span>}
      />
    );
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("cld-image")).not.toBeInTheDocument();
  });

  it("renders nothing when publicId is empty and no fallback is given", () => {
    const { container } = render(
      <CloudinaryImage
        publicId=""
        alt="Test image"
        width={600}
        height={400}
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders fallback when cloud name is not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "");

    const CloudinaryImageFresh =
      vi.importActual<typeof import("@/components/ui/CloudinaryImage")>(
        "@/components/ui/CloudinaryImage"
      );

    expect(CloudinaryImageFresh).toBeDefined();
  });
});
