import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "./Cart";
import {
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Check,
  SlidersHorizontal,
} from "lucide-react";

/**
 * ShopPage — product listing grid matching ProductPage's theme (white
 * surface, burnt-orange accent). Each card routes three ways:
 *   - tapping the image/name  -> product details page
 *   - "Add to Cart"           -> adds to cart, stays on page
 *   - "Order Now"             -> goes straight to checkout
 *
 * Drop-in requirements:
 *  - Tailwind CSS with these tokens in tailwind.config.js:
 *      colors: { ink: "#241C15", accent: "#D65A34" }
 *      fontFamily: { serif: ["Fraunces", "ui-serif", "Georgia"], sans: ["Inter", "ui-sans-serif"] }
 *  - lucide-react for icons.
 *
 * Usage:
 *   <ShopPage
 *     onViewProduct={(id) => router.push(`/product/${id}`)}
 *     onAddToCart={(id) => cart.add(id)}
 *     onOrderNow={(id) => router.push(`/checkout?product=${id}`)}
 *   />
 */

export interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  art: string; // CSS background used as an image placeholder
  image?: string;
  color?: string;
  images?: string[];
}

export interface ShopCategory {
  id: string;
  label: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: "all", label: "All" },
  { id: "women-dress", label: "Women Dress" },
  { id: "women-shoes", label: "Women Shoes" },
  { id: "men-dress", label: "Men Dress" },
  { id: "men-shoes", label: "Mens Shoes" },
  { id: "women-bag", label: "Women Bag" },
  { id: "men-bag", label: "Male Bags" },
];

// men.women,child category fetch korar jonno
const PARENT_CATEGORY_MAP: Record<string, string[]> = {
  men: ["men-dress", "men-shoes", "men-bag"],
  women: ["women-dress", "women-shoes", "women-bag"],
  child: ["child-dress", "child-shoes", "child-bag"],
};

export const DEMO_SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "p1",
    name: "Floral Midi Dress",
    category: "women-dress",
    price: 85,
    originalPrice: 110,
    rating: 4.7,
    art: "linear-gradient(160deg,#e8b98f,#c98a5c)",
    image: "/images/Floral.jpg",
    color: "white",
    images: [
      "/images/Floral.jpg",
      "/images/Product/floral  (2).jpg",
      "/images/Product/floral  (3).jpg",
      "/images/Product/floral  (4).jpg",
    ],
  },
  {
    id: "p2",
    name: "Off White Elegant Dress",
    category: "women-dress",
    price: 78,
    rating: 4.5,
    art: "linear-gradient(160deg, #f7e6d7 0%, #f7ece5 55%, #F5F0E8 100%)",
    image: "/images/white  kurti.webp",
    color: "white",

    images: [
      "/images/white  kurti.webp",
      "/images/women.png",
      "/images/banner.jpg",
      "/images/banner1.jpg",
    ],
  },
  {
    id: "p3",
    name: "Pink Summer Dress",
    category: "women-dress",
    price: 65,
    rating: 4.8,
    art: "linear-gradient(160deg,#f6b9d3,#ef86ae)",
    image: "/images/soft pink.jpg",
    color: "pink",
  },
  {
    id: "p4",
    name: "Black Cotton Kurti ",
    category: "women-dress",
    price: 95,
    originalPrice: 120,
    rating: 4.6,
    art: "linear-gradient(160deg,#3a3a3a,#0f0f0f)",
    image: "/images/black.webp",
    color: "black",
  },
  {
    id: "p5",
    name: "Classic Court Heels",
    category: "women-shoes",
    price: 72,
    rating: 4.4,
    art: "linear-gradient(160deg,#d9c3a3,#a9825a)",
    image: "/images/shoe.jpg",
  },
  {
    id: "p6",
    name: "Suede Ankle Boots",
    category: "women-shoes",
    price: 132,
    rating: 4.9,
    art: "linear-gradient(160deg,#4a4a4a,#1c1b1a)",
    image: "/images/shoes1.jpg",
  },
  {
    id: "p7",
    name: "Formal with colorfull Combo",
    category: "men-dress",
    price: 80,
    rating: 4.3,
    art: "linear-gradient(160deg,#8fb4ee,#3f6fd6)",
    image: "images/shirt.jpg",
    color: "green",
  },
  {
    id: "p8",
    name: "Tailored Blazer",
    category: "men-dress",
    price: 145,
    originalPrice: 180,
    rating: 4.7,
    art: "linear-gradient(160deg,#9a9a9a,#54524f)",
    image: "/images/blazers.webp",
    color: " mint",
  },
  {
    id: "p9",
    name: "Leather Shoes",
    category: "men-shoes",
    price: 110,
    rating: 4.6,
    art: "linear-gradient(160deg,#9a6a41,#5c3a1f)",
    image: "/images/mens shoe.jpg",
  },
  {
    id: "p10",
    name: "Structured Tote Bag",
    category: "women-bag",
    price: 89,
    rating: 4.5,
    art: "linear-gradient(160deg,#f1cbd8,#e79bb4)",
    image: "/images/leather-tote.webp",
  },
  {
    id: "p11",
    name: "Everyday Backpack",
    category: "men-bag",
    price: 62,
    rating: 4.4,
    art: "linear-gradient(160deg,#6d6d6d,#242322)",
    image: "/images/backpack.webp",
  },
  {
    id: "p12",
    name: "Womens Lather Bag",
    category: "women-bag",
    price: 54,
    originalPrice: 70,
    rating: 4.6,
    art: "linear-gradient(160deg,#c9a97a,#8a6a3f)",
    image: "/images/bag.jpg",
  },
];

const SORTS = [
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

interface ShopPageProps {
  products?: ShopProduct[];
  categories?: ShopCategory[];
  onViewProduct?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onOrderNow?: (id: string) => void;
}

export default function ShopPage({
  products = DEMO_SHOP_PRODUCTS,
  categories = SHOP_CATEGORIES,
  // onViewProduct,
  onAddToCart,
  // onOrderNow,
}: ShopPageProps) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL parameters
  const urlCategory = searchParams.get("category") || "all";
  const recommended = searchParams.get("recommended") === "true";

  // Saved onboarding preferences
  const savedPreferences = sessionStorage.getItem("stylehub_preferences");

  const preferences = savedPreferences ? JSON.parse(savedPreferences) : null;

  const selectedColors: string[] = preferences?.colors || [];

  // Shop states
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  const [sort, setSort] = useState<SortId>("popular");

  const [sortOpen, setSortOpen] = useState(false);

  const [addedId, setAddedId] = useState<string | null>(null);

  // Keep category synced with URL
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  // Filter + sort products
  const visible = useMemo(() => {
    let list = products;

    // Category filter
    // if (activeCategory !== "all") {
    //   list = list.filter((p) => p.category === activeCategory);
    // }
    if (activeCategory !== "all") {
      const categoryIds = PARENT_CATEGORY_MAP[activeCategory];

      if (categoryIds) {
        list = list.filter((p) => categoryIds.includes(p.category));
      } else {
        list = list.filter((p) => p.category === activeCategory);
      }
    }

    // Recommended color filter
    if (recommended && selectedColors.length > 0) {
      list = list.filter(
        (p) => p.color && selectedColors.includes(p.color.toLowerCase()),
      );
    }

    // Price: low to high
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    }

    // Price: high to low
    if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, activeCategory, selectedColors, recommended, sort]);

  // Add to cart
  // const handleAddToCart = (id: string) => {
  //   onAddToCart?.(id);

  //   setAddedId(id);

  //   setTimeout(() => {
  //     setAddedId((current) => (current === id ? null : current));
  //   }, 1400);
  // };
  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id);

    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      art: product.art,
    });

    onAddToCart?.(id);

    setAddedId(id);

    setTimeout(() => {
      setAddedId((current) => (current === id ? null : current));
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-6xl bg-white px-4 py-6 sm:px-8 sm:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
          Shop
        </h1>
        <p className="text-sm text-ink/50">{visible.length} products</p>
      </header>

      {/* category chips + sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200",
                  active
                    ? "border-transparent bg-accent text-white"
                    : "border-ink/12 text-ink/65 hover:border-accent/40 hover:text-accent",
                ].join(" ")}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            aria-expanded={sortOpen}
            className="flex items-center gap-2 rounded-full border border-ink/12 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-ink/65 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <SlidersHorizontal size={13} strokeWidth={2} />
            {SORTS.find((s) => s.id === sort)?.label}
          </button>
          <div
            className={[
              "absolute right-0 top-[calc(100%+8px)] z-10 w-48 rounded-2xl border border-ink/8 bg-white p-1.5 shadow-[0_18px_36px_-16px_rgba(36,28,21,0.3)] transition-all duration-200 origin-top-right",
              sortOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none",
            ].join(" ")}
          >
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSort(s.id);
                  setSortOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  sort === s.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-ink/70 hover:bg-ink/5",
                ].join(" ")}
              >
                {s.label}
                {sort === s.id && <Check size={14} strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            justAdded={addedId === p.id}
            onView={() => navigate(`/product/${p.id}`)}
            onAddToCart={() => handleAddToCart(p.id)}
            onOrderNow={() => navigate(`/checkout?product=${p.id}`)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-sm text-ink/45">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}

function ProductCard({
  product,
  justAdded,
  onView,
  onAddToCart,
  onOrderNow,
}: {
  product: ShopProduct;
  justAdded: boolean;
  onView: () => void;
  onAddToCart: () => void;
  onOrderNow: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const discountPct = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 transition-shadow duration-300 hover:shadow-[0_16px_32px_-18px_rgba(36,28,21,0.3)]">
      <button
        type="button"
        onClick={onView}
        aria-label={`View ${product.name}`}
        className="relative aspect-[4/5] w-full overflow-hidden"
        style={{ background: product.art }}
      >
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5" />
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          role="button"
          aria-label="Save to wishlist"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/60 backdrop-blur transition-colors hover:text-accent"
        >
          <Heart
            size={14}
            strokeWidth={2}
            fill={saved ? "currentColor" : "none"}
            className={saved ? "text-accent" : ""}
          />
        </span>
        {discountPct && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
            -{discountPct}%
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pt-2.5">
        <button type="button" onClick={onView} className="text-left">
          <p className="truncate text-[13px] sm:text-sm font-medium text-ink/85">
            {product.name}
          </p>
        </button>
        <div className="flex items-center gap-1">
          <Star size={11} strokeWidth={0} fill="#D65A34" />
          <span className="text-[11px] text-ink/45">
            {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-accent">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-ink/35 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* side-by-side actions */}
      <div className="grid grid-cols-2 gap-2 px-3 pb-3 pt-2.5">
        <button
          type="button"
          onClick={onAddToCart}
          className={[
            "flex items-center justify-center gap-1.5 rounded-full border py-2 text-[11px] sm:text-xs font-semibold transition-all duration-200 active:scale-[0.97]",
            justAdded
              ? "border-emerald-600 text-emerald-600"
              : "border-accent text-accent hover:bg-accent/8",
          ].join(" ")}
        >
          {justAdded ? (
            <Check size={13} strokeWidth={2.5} />
          ) : (
            <ShoppingBag size={13} strokeWidth={2} />
          )}
          {justAdded ? "Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={onOrderNow}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#ed5a2b] py-2 text-[11px] sm:text-xs font-semibold text-orange shadow-[0_8px_18px_-8px_rgba(214,90,52,0.6)] transition-all duration-200 hover:brightness-105 active:scale-[0.97]"
        >
          <Zap size={13} strokeWidth={2} />
          Order Now
        </button>
      </div>
    </article>
  );
}
