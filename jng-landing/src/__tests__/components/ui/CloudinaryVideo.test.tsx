import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CloudinaryVideo from "@/components/ui/CloudinaryVideo";

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MockPlayer = (props: Record<string, unknown>) => (
      <video
        data-testid="cld-video"
        data-src={props.src as string}
        data-width={props.width as number}
        data-height={props.height as number}
      />
    );
    MockPlayer.displayName = "MockCldVideoPlayer";
    return MockPlayer;
  },
}));

vi.mock("next-cloudinary/dist/cld-video-player.css", () => ({}));

describe("CloudinaryVideo", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "test-cloud");
  });

  it("renders a wrapper div with the provided className", () => {
    const { container } = render(
      <CloudinaryVideo
        publicId="about-video"
        width={1280}
        height={720}
        className="aspect-video"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("aspect-video");
  });

  it("renders fallback when publicId is empty", () => {
    render(
      <CloudinaryVideo
        publicId=""
        width={1280}
        height={720}
        fallback={<span data-testid="video-fallback">No video</span>}
      />
    );
    expect(screen.getByTestId("video-fallback")).toBeInTheDocument();
  });

  it("renders nothing when publicId is empty and no fallback", () => {
    const { container } = render(
      <CloudinaryVideo publicId="" width={1280} height={720} />
    );
    expect(container.innerHTML).toBe("");
  });
});
