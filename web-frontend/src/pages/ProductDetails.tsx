import { useParams, useNavigate } from "react-router-dom";
import ProductPage from "./ProductPage";
import { DEMO_SHOP_PRODUCTS } from "./Shop";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // URL থেকে id নিয়ে Shop-এর product খুঁজবে
  const product = DEMO_SHOP_PRODUCTS.find((p) => p.id === id);

  console.log("URL ID:", id);
  console.log("FOUND PRODUCT:", product);

  // Product না পাওয়া গেলে
  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-ink">Product not found</h1>

          <p className="mt-2 text-sm text-ink/60">Product ID: {id}</p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductPage
      product={{
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image ?? "",
        images: product.images ?? (product.image ? [product.image] : []),
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: 0,

        shortDescription:
          "A beautiful and stylish product designed for a comfortable and elegant look.",

        description:
          "Beautiful and stylish product designed for a comfortable and elegant look.",

        highlights: [
          "Premium quality",
          "Comfortable to wear",
          "Modern design",
          "Perfect for everyday use",
        ],

        // Variation ProductPage-এ manually add করবেন
        variations: [],

        sizes: [
          { id: "s", label: "S", available: true },
          { id: "m", label: "M", available: true },
          { id: "l", label: "L", available: true },
          { id: "xl", label: "XL", available: false },
        ],
      }}
    />
  );
}
