import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
    title: "Lager 21 Inventory API",
})
@server("http://localhost:3000", "Development server")
namespace Lager21;

/**
 * Product variant with optional attributes.
 * Color can be a single string or array of strings.
 */
model VariantOption {
    /** Color options - can be string or string array in raw JSON */
    color?: string | string[];
    /** Power options in watts (for lighting products) */
    power?: float64[];
    /** Storage options in GB (for electronics) */
    storage?: string[];
    /** Stock quantity for this variant */
    quantity: int32;
}

/**
 * A product in the inventory.
 */
model Product {
    id: int32;
    name: string;
    brand: string;
    /** Price in SEK (stored as string in JSON) */
    price: string;
    available: boolean;
    weight: float64;
    options: VariantOption[];
}

/**
 * Root inventory structure from third-party JSON.
 */
model InventoryData {
    items: Product[];
}

model ProductListResponse {
    products: Product[];
    total: int32;
}

@error
model ErrorResponse {
    error: string;
}

@route("/api/products")
@tag("Products")
interface Products {
    @get
    list(@query available?: boolean): ProductListResponse;

    @get
    @route("{id}")
    get(@path id: int32): Product | NotFoundResponse;
}
