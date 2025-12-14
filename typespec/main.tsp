import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
    title: "Lager 21 API",
})
@server("http://localhost:3000", "Development server")
namespace Lager21;

model VariantOption {
    attributes: Record<unknown[]>;
    quantity: int32;
}

model Product {
    id: int32;
    name: string;
    brand: string;
    price: float64;
    available: boolean;
    weight: float64;
    options: VariantOption[];
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
