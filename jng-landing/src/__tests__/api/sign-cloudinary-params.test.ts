import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/cloudinary-server", () => ({
  signCloudinaryUploadParams: vi
    .fn()
    .mockReturnValue("mocked-signature-abc123"),
}));

async function callSignRoute(body: unknown) {
  const { POST } = await import(
    "@/app/api/sign-cloudinary-params/route"
  );
  const request = new Request(
    "http://localhost:3000/api/sign-cloudinary-params",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  return POST(request);
}

describe("POST /api/sign-cloudinary-params", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a signature for valid params", async () => {
    const res = await callSignRoute({
      paramsToSign: { timestamp: 1234567890, folder: "jng/uploads" },
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.signature).toBe("mocked-signature-abc123");
  });

  it("returns 400 for missing paramsToSign", async () => {
    const res = await callSignRoute({});
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 400 for invalid body structure", async () => {
    const res = await callSignRoute({ paramsToSign: "not-an-object" });
    expect(res.status).toBe(400);
  });

  it("returns 500 for malformed JSON", async () => {
    const { POST } = await import(
      "@/app/api/sign-cloudinary-params/route"
    );
    const request = new Request(
      "http://localhost:3000/api/sign-cloudinary-params",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{invalid json",
      }
    );
    const res = await POST(request);
    expect(res.status).toBe(500);
  });
});
