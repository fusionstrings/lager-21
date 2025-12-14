import { describe, expect, it } from "vitest";
import {
    getAttributeDisplay,
    getVariantStock,
    toTitleCase,
} from "./variant-config";
import type { SelectedVariant, VariantOption } from "./types";

describe("variant-config", () => {
    describe("toTitleCase", () => {
        it("converts lowercase to title case", () => {
            expect(toTitleCase("color")).toBe("Color");
        });

        it("handles already capitalized strings", () => {
            expect(toTitleCase("Color")).toBe("Color");
        });

        it("handles uppercase strings", () => {
            expect(toTitleCase("COLOR")).toBe("Color");
        });
    });

    describe("getAttributeDisplay", () => {
        it("returns config for known attributes", () => {
            expect(getAttributeDisplay("Power").suffix).toBe("W");
        });

        it("returns default config for unknown attributes", () => {
            expect(getAttributeDisplay("Unknown").suffix).toBe("");
        });
    });

    describe("getVariantStock", () => {
        const options: VariantOption[] = [
            { attributes: { Color: ["red"], Size: ["S"] }, quantity: 5 },
            { attributes: { Color: ["red"], Size: ["M"] }, quantity: 0 },
            { attributes: { Color: ["blue"], Size: ["S"] }, quantity: 3 },
        ];

        it("returns stock for matching variant", () => {
            const variant: SelectedVariant = { Color: "red", Size: "S" };
            expect(getVariantStock(options, variant)).toBe(5);
        });

        it("returns 0 for out-of-stock variant", () => {
            const variant: SelectedVariant = { Color: "red", Size: "M" };
            expect(getVariantStock(options, variant)).toBe(0);
        });

        it("returns undefined for undefined variant", () => {
            expect(getVariantStock(options, undefined)).toBeUndefined();
        });

        it("returns undefined for non-matching variant", () => {
            const variant: SelectedVariant = { Color: "green", Size: "S" };
            expect(getVariantStock(options, variant)).toBeUndefined();
        });

        it("returns undefined for partial variant selection", () => {
            const variant: SelectedVariant = { Color: "red" };
            expect(getVariantStock(options, variant)).toBeUndefined();
        });
    });
});
