import { test, expect } from "@playwright/test";

test.describe("Landing Page - Full E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the landing page with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Jóvenes Nueva Generación/i);
  });

  test("renders all main sections in the correct order", async ({ page }) => {
    await expect(page.locator("#inicio")).toBeVisible();
    await expect(page.locator("#nosotros")).toBeVisible();
    await expect(page.locator("#servicios")).toBeVisible();
    await expect(page.locator("#caipra")).toBeVisible();
    await expect(page.locator("#testimonios")).toBeVisible();
    await expect(page.locator("#contacto")).toBeVisible();
    await expect(page.locator("#ubicacion")).toBeVisible();
  });

  test.describe("Header Navigation", () => {
    test("displays the fixed header", async ({ page }) => {
      const header = page.locator("header");
      await expect(header).toBeVisible();
    });

    test("navigates to sections when clicking nav links", async ({
      page,
    }) => {
      await page.click('a[href="#servicios"]');
      await expect(page.locator("#servicios")).toBeInViewport();
    });

    test("opens and closes mobile menu", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();

      const menuButton = page.getByLabel("Abrir menú");
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      const closeButton = page.getByLabel("Cerrar menú");
      await expect(closeButton).toBeVisible();
      await closeButton.click();

      await expect(page.getByLabel("Abrir menú")).toBeVisible();
    });
  });

  test.describe("Hero Section", () => {
    test("displays the main heading", async ({ page }) => {
      const heading = page.getByRole("heading", {
        name: /Jóvenes Nueva Generación/i,
        level: 1,
      });
      await expect(heading).toBeVisible();
    });

    test("displays CTA buttons", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: /WhatsApp/i }).first()
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Contáctanos/i })
      ).toBeVisible();
    });

    test("WhatsApp button links to wa.me", async ({ page }) => {
      const waLink = page.getByRole("link", { name: /WhatsApp/i }).first();
      const href = await waLink.getAttribute("href");
      expect(href).toContain("wa.me");
    });
  });

  test.describe("About Us Section", () => {
    test("displays the section heading", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /Sobre Nosotros/i })
      ).toBeVisible();
    });

    test("displays all pillar cards", async ({ page }) => {
      await expect(page.getByText("Bienestar Integral")).toBeVisible();
      await expect(
        page.getByText("Equipo Multidisciplinario")
      ).toBeVisible();
      await expect(page.getByText("Desarrollo Personal")).toBeVisible();
      await expect(
        page.getByText("Especialistas Certificados")
      ).toBeVisible();
    });
  });

  test.describe("Services Section", () => {
    test("displays all services", async ({ page }) => {
      const services = [
        "Consejero en Adicciones",
        "Doctor",
        "Psicólogo",
        "INAEBA",
        "Terapias Espirituales",
        "Espacios para Recreación Física",
      ];
      for (const svc of services) {
        await expect(page.getByText(svc)).toBeVisible();
      }
    });
  });

  test.describe("CAIPRA Section", () => {
    test("displays the CAIPRA heading", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /CAIPRA/i })
      ).toBeVisible();
    });

    test("displays phone numbers", async ({ page }) => {
      await expect(page.getByText("477 705 9608")).toBeVisible();
      await expect(page.getByText("477 630 0533")).toBeVisible();
      await expect(page.getByText("477 449 1551")).toBeVisible();
    });
  });

  test.describe("Testimonials Section", () => {
    test("displays testimonials", async ({ page }) => {
      const names = ["Carlos M.", "María L.", "Roberto G.", "Ana P."];
      for (const name of names) {
        await expect(page.getByText(name)).toBeVisible();
      }
    });

    test("displays privacy disclaimer", async ({ page }) => {
      await expect(
        page.getByText(/Los nombres han sido cambiados/i)
      ).toBeVisible();
    });
  });

  test.describe("Contact Section", () => {
    test("displays the contact form", async ({ page }) => {
      const form = page.locator("#contacto form");
      await expect(form).toBeVisible();
    });

    test("contact form validation - requires fields", async ({ page }) => {
      const submitBtn = page
        .locator("#contacto")
        .getByRole("button", { name: /Enviar Mensaje/i });

      await submitBtn.scrollIntoViewIfNeeded();
      await submitBtn.click();

      // HTML5 validation should prevent submission with empty required fields
      const nombreInput = page.locator("#nombre");
      const isValid = await nombreInput.evaluate(
        (el) => (el as HTMLInputElement).validity.valid
      );
      expect(isValid).toBe(false);
    });

    test("submits contact form with valid data", async ({ page }) => {
      await page.fill("#nombre", "Test User");
      await page.fill("#telefono", "477 123 4567");
      await page.fill("#email", "test@example.com");
      await page.fill(
        "#mensaje",
        "Este es un mensaje de prueba para el formulario de contacto."
      );

      await page.route("**/api/contact", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message:
              "¡Gracias por contactarnos! Nos comunicaremos contigo lo antes posible.",
          }),
        });
      });

      await page.click('button:has-text("Enviar Mensaje")');

      await expect(
        page.getByText(/¡Mensaje enviado!/i)
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Map / Location Section", () => {
    test("displays the Google Maps iframe", async ({ page }) => {
      const iframe = page.locator(
        'iframe[title*="Ubicación de Jóvenes Nueva Generación"]'
      );
      await expect(iframe).toBeVisible();
    });

    test("displays the address", async ({ page }) => {
      await expect(
        page
          .getByText(/Calle Tzulá #124, Col. Los Castillos/i)
          .first()
      ).toBeVisible();
    });
  });

  test.describe("Footer", () => {
    test("displays the brand name", async ({ page }) => {
      const footer = page.locator("footer");
      await expect(
        footer.getByText("Jóvenes Nueva Generación A.C.")
      ).toBeVisible();
    });

    test("displays the current year", async ({ page }) => {
      const year = new Date().getFullYear().toString();
      await expect(
        page.locator("footer").getByText(new RegExp(year))
      ).toBeVisible();
    });

    test("has developer credit link", async ({ page }) => {
      const devLink = page.getByRole("link", { name: /Fer Sanz Dev/i });
      await expect(devLink).toBeVisible();
      expect(await devLink.getAttribute("href")).toBe(
        "https://www.fersanz.dev"
      );
    });
  });

  test.describe("WhatsApp FAB", () => {
    test("displays the floating WhatsApp button", async ({ page }) => {
      const fab = page.getByLabel("Contactar por WhatsApp");
      await expect(fab).toBeVisible();
    });

    test("WhatsApp FAB links to wa.me", async ({ page }) => {
      const fab = page.getByLabel("Contactar por WhatsApp");
      const href = await fab.getAttribute("href");
      expect(href).toContain("wa.me");
    });
  });

  test.describe("Responsive Design", () => {
    test("renders correctly on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      await expect(
        page.getByRole("heading", {
          name: /Jóvenes Nueva Generación/i,
          level: 1,
        })
      ).toBeVisible();
    });

    test("renders correctly on tablet viewport", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await expect(
        page.getByRole("heading", {
          name: /Jóvenes Nueva Generación/i,
          level: 1,
        })
      ).toBeVisible();
    });
  });

  test.describe("SEO & Accessibility", () => {
    test("has correct meta description", async ({ page }) => {
      const metaDesc = page.locator('meta[name="description"]');
      const content = await metaDesc.getAttribute("content");
      expect(content).toContain("CEPAAV");
    });

    test("all images have alt text", async ({ page }) => {
      const images = page.locator("img");
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).toBeTruthy();
      }
    });

    test("page language is set to Spanish", async ({ page }) => {
      const lang = await page.locator("html").getAttribute("lang");
      expect(lang).toBe("es");
    });

    test("heading hierarchy is correct (single h1)", async ({ page }) => {
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });
  });

  test.describe("Performance", () => {
    test("page loads within acceptable time", async ({ page }) => {
      const start = Date.now();
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(10000);
    });
  });
});
