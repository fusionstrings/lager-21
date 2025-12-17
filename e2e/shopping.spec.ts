import { expect, type Page, test } from "@playwright/test";

async function selectAllVariants(page: Page) {
    const optionGroups = page.locator(".form-control");
    const groupCount = await optionGroups.count();

    for (let i = 0; i < groupCount; i++) {
        const firstOption = optionGroups.nth(i).locator("button.btn-outline")
            .first();
        if (await firstOption.isVisible()) {
            await firstOption.click();
        }
    }
}

test.describe("Shopping Flow", () => {
    test("browse products on home page", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator("h1")).toContainText(
            /Quality.*Products.*Delivered/,
        );
        await expect(page.locator("h2")).toContainText("Catalog");

        const productCards = page.locator("article");
        await expect(productCards).toHaveCount(9);
    });

    test("view product details", async ({ page }) => {
        await page.goto("/");
        await page.locator("article").first().click();

        await expect(page).toHaveURL(/\/product\/\d+/);
        await expect(page.locator("h1")).toBeVisible();
    });

    test("add product to cart", async ({ page }) => {
        await page.goto("/product/1");
        await selectAllVariants(page);

        const addButton = page.locator("button", { hasText: /add to cart/i });
        await expect(addButton).toBeEnabled();
        await addButton.click();

        const cartCount = page.locator(
            "nav a[aria-label='Cart'] span.absolute",
        );
        await expect(cartCount).toContainText("1");
    });

    test("checkout page shows cart items", async ({ page }) => {
        await page.goto("/product/1");
        await selectAllVariants(page);
        await page.locator("button", { hasText: /add to cart/i }).click();

        await page.goto("/checkout");

        await expect(page.locator("h1")).toContainText("Shopping Cart");
        const cartItems = page.locator(".card.bg-base-100.shadow-sm");
        await expect(cartItems.first()).toBeVisible();
    });

    test("increase and decrease quantity", async ({ page }) => {
        await page.goto("/product/1");
        await selectAllVariants(page);
        await page.locator("button", { hasText: /add to cart/i }).click();

        await page.goto("/checkout");

        const plusButton = page.locator(
            "button[aria-label='Increase quantity']",
        ).first();
        await plusButton.click();

        const cartCount = page.locator(
            "nav a[aria-label='Cart'] span.absolute",
        );
        await expect(cartCount).toContainText("2");
    });

    test("remove item from cart", async ({ page }) => {
        await page.goto("/product/1");
        await selectAllVariants(page);
        await page.locator("button", { hasText: /add to cart/i }).click();

        await page.goto("/checkout");
        await expect(page.locator("h1")).toContainText("Shopping Cart");

        await page.locator("button", { hasText: /remove/i }).click();

        await expect(page.locator("h2")).toContainText("Your cart is empty");
    });

    test("empty cart shows message", async ({ page }) => {
        await page.goto("/checkout");

        await expect(page.locator("h2")).toContainText("Your cart is empty");
        await expect(page.locator("a", { hasText: /start shopping/i }))
            .toBeVisible();
    });

    test("404 page", async ({ page }) => {
        await page.goto("/nonexistent-page");

        await expect(page.locator("h1")).toContainText("404");
        await expect(page.locator("a", { hasText: /back to homepage/i }))
            .toBeVisible();
    });
});

test.describe("API", () => {
    test("GET /api/products returns products", async ({ request }) => {
        const response = await request.get("/api/products");

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.products).toBeDefined();
        expect(Array.isArray(data.products)).toBe(true);
        expect(data.products.length).toBeGreaterThan(0);
    });

    test("GET /api/products?available=true filters by availability", async ({ request }) => {
        const response = await request.get("/api/products?available=true");

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.products.every((p: { available: boolean }) => p.available))
            .toBe(true);
    });
});

test.describe("Brand Pages", () => {
    test("brand page shows filtered products", async ({ page }) => {
        await page.goto("/brand/sony");

        await expect(page.locator("h1")).toContainText("Sony");
        const productCards = page.locator("article");
        await expect(productCards.first()).toBeVisible();
    });

    test("breadcrumb navigates to brand page", async ({ page }) => {
        await page.goto("/product/3");

        const brandLink = page.locator(".breadcrumbs a", { hasText: "Sony" });
        await brandLink.click();

        await expect(page).toHaveURL(/\/brand\/sony/);
        await expect(page.locator("h1")).toContainText("Sony");
    });

    test("non-existent brand shows 404", async ({ page }) => {
        await page.goto("/brand/nonexistentbrand");

        await expect(page.locator("h1")).toContainText("404");
    });
});
