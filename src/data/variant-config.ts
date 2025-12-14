import type { SelectedVariant, VariantOption } from "#data/types";

type AttributeDisplayConfig = {
    suffix: string;
};

const attributeDisplayMap: Record<string, AttributeDisplayConfig> = {
    Power: { suffix: "W" },
    Storage: { suffix: "" },
    Color: { suffix: "" },
};

const defaultConfig: AttributeDisplayConfig = { suffix: "" };

/**
 * Returns display configuration for an attribute key.
 */
function getAttributeDisplay(key: string) {
    return attributeDisplayMap[key] ?? defaultConfig;
}

/**
 * Converts a string to title case.
 */
function toTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Finds the stock quantity for a given variant selection.
 * @returns Stock quantity, or undefined if no matching variant exists.
 */
function getVariantStock(
    options: VariantOption[],
    variant: SelectedVariant | undefined,
) {
    if (!variant) {
        return undefined;
    }

    const match = options.find((option) => {
        for (const [key, values] of Object.entries(option.attributes)) {
            const selected = variant[key];
            if (selected === undefined || !values.includes(selected)) {
                return false;
            }
        }
        return true;
    });

    return match?.quantity;
}

export { getAttributeDisplay, getVariantStock, toTitleCase };
