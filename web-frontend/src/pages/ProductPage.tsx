// import { useParams, useNavigate } from "react-router-dom";
// import { DEMO_SHOP_PRODUCTS } from "./Shop";
// import { useMemo } from "react";
import { useEffect, useState, type ComponentType } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

/**
 * ProductDetails — premium 3-column product page.
 *
 *   ┌────────────┬────────────┬────────────┐
 *   │  Gallery   │   Info     │  Details   │
 *   │ (image only)│(name/price/│ (accordions│
 *   │            │ color/size/│  only)     │
 *   │            │ qty/actions)│           │
 *   └────────────┴────────────┴────────────┘
 *
 * Stacks to a single column on mobile in the same order.
 *
 * Drop-in requirements:
 *  - Tailwind CSS with these tokens in tailwind.config.js:
 *      colors: { cream: "#FBF6EF", ink: "#241C15", accent: "#D65A34" }
 *      fontFamily: { serif: ["Fraunces", "ui-serif", "Georgia"], sans: ["Inter", "ui-sans-serif"] }
 *  - lucide-react for icons.
 *
 * The core rule this page enforces: Color → Variation → Image Array →
 * Thumbnails → Main Image. Picking a color swaps `activeVariation`, which
 * resets the gallery to that variation's own image list, starting at its
 * first ("front") photo.
 */

/* --------------------------------- Types --------------------------------- */

export interface ProductVariation {
  id: string;
  colorId: string;
  colorName: string;
  /** hex used for the color swatch circle */
  swatch: string;
  /** front, back, side, detail — in display order */
  images: string[];
}

export interface ProductSize {
  id: string;
  label: string;
  available: boolean;
}

export interface ProductDetail {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  variations: ProductVariation[];
  sizes: ProductSize[];
}

export interface ProductSelection {
  variationId: string;
  sizeId: string | null;
  quantity: number;
}

/* ------------------------------ Sample data ------------------------------ */
/* Swap these URLs for real front/back/side/detail shots per color. Each
   variation below reuses one stock photo across its four slots as a
   stand-in — replace with your actual multi-angle product photography. */

export const DEMO_PRODUCT: ProductDetail = {
  id: "p1",
  name: "Floral Wrap Midi Dress",
  image: "/images/Floral.jpg",
  category: "Women / Dresses",
  price: 85,
  originalPrice: 110,
  rating: 4.7,
  reviewCount: 328,
  shortDescription:
    "A breezy wrap-cut midi in soft crepe, finished with a self-tie waist.",
  description:
    "A breezy midi dress cut from soft crepe with a flattering wrap silhouette. Finished with a self-tie waist and a fluid, floor-skimming hem — dress it up or down.",
  highlights: [
    "Soft, breathable crepe fabric",
    "Adjustable self-tie waist",
    "Lined bodice, true to size",
    "Machine washable",
  ],
  variations: [
    {
      id: "p1",
      colorId: "beige",
      colorName: "Beige",
      swatch: "#D9C3A3",
      images: [
        "/images/Floral.jpg",
        "/images/women.png",
        "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=1000&q=80&auto=format&fit=crop&crop=left",
        "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=1000&q=80&auto=format&fit=crop&crop=right",
      ],
    },
    {
      id: "p2",
      colorId: "black",
      colorName: "Black",
      swatch: "#1C1B1A",
      images: [
        "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?w=1000&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?w=1000&q=80&auto=format&fit=crop&flip=h",
        "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?w=1000&q=80&auto=format&fit=crop&crop=left",
        "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?w=1000&q=80&auto=format&fit=crop&crop=right",
      ],
    },
    {
      id: "p3",
      colorId: "pink",
      colorName: "Pink",
      swatch: "#F17FAE",
      images: [
        "https://images.unsplash.com/photo-1479812627010-aa5bd9d173b1?w=1000&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1479812627010-aa5bd9d173b1?w=1000&q=80&auto=format&fit=crop&flip=h",
        "https://images.unsplash.com/photo-1479812627010-aa5bd9d173b1?w=1000&q=80&auto=format&fit=crop&crop=left",
        "https://images.unsplash.com/photo-1479812627010-aa5bd9d173b1?w=1000&q=80&auto=format&fit=crop&crop=right",
      ],
    },
  ],
  sizes: [
    { id: "xs", label: "XS", available: true },
    { id: "s", label: "S", available: true },
    { id: "m", label: "M", available: true },
    { id: "l", label: "L", available: true },
    { id: "xl", label: "XL", available: false },
  ],
};

/* --------------------------------- Page --------------------------------- */

interface ProductDetailsProps {
  product?: ProductDetail;
  onAddToCart?: (selection: ProductSelection) => void;
  onOrderNow?: (selection: ProductSelection) => void;
}

export default function ProductDetails({
  product = DEMO_PRODUCT,
  onAddToCart,
  onOrderNow,
}: ProductDetailsProps) {
  const [activeVariationId, setActiveVariationId] = useState(
    product.variations[0]?.id ?? "",
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // const activeVariation =
  //   product.variations.find((v) => v.id === activeVariationId) ??
  //   product.variations[0];
  // const images = activeVariation?.images ?? [];
  const activeVariation =
    product.variations.find((v) => v.id === activeVariationId) ??
    product.variations[0];

  // const images = [
  //   ...(product.image ? [product.image] : []),
  //   ...(activeVariation?.images ?? []),
  // ];

  const images =
    product.images && product.images.length > 0
      ? product.images
      : activeVariation?.images?.length
        ? activeVariation.images
        : product.image
          ? [product.image]
          : [];

  const selectVariation = (variationId: string) => {
    setActiveVariationId(variationId);
    setActiveImageIndex(0); // Color → Variation → Image Array resets to the first ("front") shot
  };

  const goPrev = () =>
    setActiveImageIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveImageIndex((i) => (i + 1) % images.length);

  const buildSelection = (): ProductSelection => ({
    variationId: activeVariationId,
    sizeId,
    quantity,
  });

  const requireSize = (): boolean => {
    if (!sizeId) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1600);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    onAddToCart?.(buildSelection());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleOrderNow = () => {
    if (!requireSize()) return;
    onOrderNow?.(buildSelection());
  };

  const discountPct = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="mx-auto max-w-6xl bg-cream px-4 py-6 sm:px-8 sm:py-10">
      {/* <div className="grid gap-10 md:grid-cols-3 md:gap-8"> */}
      <div className="grid gap-10 md:grid-cols-[1fr_1.25fr_1fr] md:gap-8">
        <ProductGallery
          images={images}
          productName={product.name}
          discountPct={discountPct}
          activeIndex={activeImageIndex}
          onSelectIndex={setActiveImageIndex}
          onPrev={goPrev}
          onNext={goNext}
          onOpenLightbox={() => setLightboxOpen(true)}
        />

        <ProductInfo
          product={product}
          activeVariation={activeVariation}
          onSelectColor={selectVariation}
          sizeId={sizeId}
          sizeError={sizeError}
          onSelectSize={(id) => {
            setSizeId(id);
            setSizeError(false);
          }}
          quantity={quantity}
          onQuantityChange={setQuantity}
          justAdded={justAdded}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
        />
        {/* 
        <ProductAccordions highlights={product.highlights} /> */}
        <ProductAccordions product={product} />
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={activeImageIndex}
          productName={product.name}
          onClose={() => setLightboxOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discountPct: number | null;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenLightbox: () => void;
}

/* -------------------------------- Gallery -------------------------------- */
function ProductGallery({
  images,
  productName,
  discountPct,
  activeIndex,
  onSelectIndex,
  onPrev,
  onNext,
  onOpenLightbox,
}: ProductGalleryProps) {
  return (
    <div className="flex flex-col">
      {/* BIG PRODUCT IMAGE */}
      <button
        type="button"
        onClick={onOpenLightbox}
        aria-label="Open full-size image"
        className="group relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-3xl bg-white sm:mx-0"
      >
        {images[activeIndex] && (
          <img
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* DISCOUNT */}
        {discountPct && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            -{discountPct}%
          </span>
        )}

        {/* PREVIOUS / NEXT */}
        {images.length > 1 && (
          <>
            <span
              role="button"
              tabIndex={0}
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onPrev();
              }}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink/70 shadow-sm transition-colors hover:text-accent"
            >
              <ChevronLeft size={17} strokeWidth={2.25} />
            </span>

            <span
              role="button"
              tabIndex={0}
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onNext();
              }}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink/70 shadow-sm transition-colors hover:text-accent"
            >
              <ChevronRight size={17} strokeWidth={2.25} />
            </span>
          </>
        )}
      </button>

      {/* THUMBNAILS */}
      <div className="mt-3 flex gap-3 overflow-x-auto">
        {images.map((src, i) => {
          const active = activeIndex === i;

          return (
            <button
              key={src + i}
              type="button"
              onClick={() => onSelectIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={active}
              className={[
                "h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl transition-all duration-200",
                active
                  ? "ring-2 ring-[#D65A34] ring-offset-2 ring-offset-cream"
                  : "ring-1 ring-ink/12 opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              <img
                src={src}
                alt={`Product image ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Lightbox -------------------------------- */

interface LightboxProps {
  images: string[];
  index: number;
  productName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({
  images,
  index,
  productName,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
      >
        <X size={20} strokeWidth={2.25} />
      </button>

      <img
        src={images[index]}
        alt={productName}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
          >
            <ChevronLeft size={20} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
          >
            <ChevronRight size={20} strokeWidth={2.25} />
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------ Product Info ------------------------------ */

interface ProductInfoProps {
  product: ProductDetail;
  activeVariation: ProductVariation | undefined;
  onSelectColor: (variationId: string) => void;
  sizeId: string | null;
  sizeError: boolean;
  onSelectSize: (sizeId: string) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
  justAdded: boolean;
  onAddToCart: () => void;
  onOrderNow: () => void;
}

function ProductInfo({
  product,
  activeVariation,
  onSelectColor,
  sizeId,
  sizeError,
  onSelectSize,
  quantity,
  onQuantityChange,
  justAdded,
  onAddToCart,
  onOrderNow,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
          {product.category}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl leading-tight text-ink">
          {product.name}
        </h1>
        <p className="text-sm leading-relaxed text-ink/60">
          {product.shortDescription}
        </p>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-semibold text-[#C85A32]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-ink/35 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {typeof product.rating === "number" && (
          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="flex items-center gap-0.5 text-[#C85A32]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  strokeWidth={0}
                  fill={
                    i < Math.round(product.rating ?? 0)
                      ? "currentColor"
                      : "#E7E1D8"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-ink/45">
              {product.rating.toFixed(1)} · {product.reviewCount ?? 0} reviews
            </span>
          </div>
        )}
      </div>

      <ColorSelector
        variations={product.variations}
        activeVariation={activeVariation}
        onSelect={onSelectColor}
      />
      <SizeSelector
        sizes={product.sizes}
        sizeId={sizeId}
        sizeError={sizeError}
        onSelect={onSelectSize}
      />
      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <QuantitySelector quantity={quantity} onChange={onQuantityChange} />
        <ProductActions
          justAdded={justAdded}
          onAddToCart={onAddToCart}
          onOrderNow={onOrderNow}
        />
      </div>
    </div>
  );
}

/* ------------------------------ Color selector ----------------------------- */

function ColorSelector({
  variations,
  activeVariation,
  onSelect,
}: {
  variations: ProductVariation[];
  activeVariation: ProductVariation | undefined;
  onSelect: (variationId: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      {/* <p className="text-sm font-medium text-ink/80">
        Color
        {activeVariation && (
          <span className="text-ink/40"> · {activeVariation.colorName}</span>
        )}
      </p> */}

      <div className="flex gap-3">
        {variations.map((v) => {
          const active = activeVariation?.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(v.id)}
              className={[
                "relative flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-cream transition-transform duration-200",
                active
                  ? "ring-accent scale-105 bg-accent"
                  : "ring-ink/15 hover:scale-105 bg-white",
              ].join(" ")}
            >
              <span
                className="absolute inset-1 rounded-full"
                style={{
                  background: v.swatch,
                  boxShadow:
                    v.swatch === "#FFFFFF"
                      ? "inset 0 0 0 1px rgba(36,28,21,0.15)"
                      : undefined,
                }}
              />
              {active && (
                <Check
                  size={13}
                  strokeWidth={3}
                  className="relative z-10 text-white drop-shadow"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Size selector ------------------------------ */

function SizeSelector({
  sizes,
  sizeId,
  sizeError,
  onSelect,
}: {
  sizes: ProductSize[];
  sizeId: string | null;
  sizeError: boolean;
  onSelect: (sizeId: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-sm font-medium text-ink/80">Size</p>
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((s) => {
          const active = sizeId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={!s.available}
              aria-pressed={active}
              onClick={() => onSelect(s.id)}
              className={[
                "flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border px-3 text-sm font-medium transition-all duration-200",
                !s.available
                  ? "border-ink/10 bg-white text-ink/25 line-through cursor-not-allowed"
                  : active
                    ? "border-transparent bg-[#C85A32] text-white shadow-[0_8px_18px_-8px_rgba(214,90,52,0.6)]"
                    : "border-ink/15 bg-white text-ink/75 hover:border-[#C85A32]",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {sizeError && (
        <p className="text-xs font-medium text-accent">
          Please select a size to continue.
        </p>
      )}
    </div>
  );
}

/* ----------------------------- Quantity selector ---------------------------- */

function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (q: number) => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-ink/15 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="flex h-11 w-10 items-center justify-center text-ink/60 hover:[#C85A32]"
      >
        <span className="text-lg leading-none">−</span>
      </button>
      <span className="w-6 text-center text-sm font-semibold text-ink">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(9, quantity + 1))}
        className="flex h-11 w-10 items-center justify-center text-ink/60 hover:text-accent"
      >
        <span className="text-lg leading-none">+</span>
      </button>
    </div>
  );
}

/* ------------------------------ Product actions ----------------------------- */

function ProductActions({
  justAdded,
  onAddToCart,
  onOrderNow,
}: {
  justAdded: boolean;
  onAddToCart: () => void;
  onOrderNow: () => void;
}) {
  return (
    <div className="flex flex-1 gap-2">
      <button
        type="button"
        onClick={onAddToCart}
        className={[
          "flex w-full h-12 mt-2 items-center justify-center gap-2 rounded-full border py-3  text-sm sm:text-base font-semibold transition-all duration-300 active:scale-[0.98]   ",
          justAdded
            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
            : "border-ink/15 bg-white text-ink hover:border-[#C85A32]",
        ].join(" ")}
      >
        {justAdded ? (
          <Check size={17} strokeWidth={2.5} />
        ) : (
          <ShoppingBag size={17} strokeWidth={2} />
        )}
        {justAdded ? "Added" : "Add to Cart"}
      </button>
      <button
        type="button"
        onClick={onOrderNow}
        className="flex w-full h-12 mt-2 items-center justify-center gap-2 rounded-full bg-[#C85A32] py-3 text-sm sm:text-base font-semibold text-white shadow-[0_12px_26px_-10px_rgba(214,90,52,0.65)] transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
      >
        <Zap size={17} strokeWidth={2} />
        Order Now
      </button>
    </div>
  );
}

/* ------------------------------- Accordions -------------------------------- */

// function ProductAccordions({ highlights }: { highlights: string[] }) {
//   const [open, setOpen] = useState<"shipping" | "returns" | null>("details");
//   const toggle = (key: "shipping" | "returns") =>
//     setOpen((cur) => (cur === key ? null : key));

//   return (
//     <div className="h-fit divide-y divide-ink/8 rounded-2xl border border-ink/8 bg-white sm:sticky sm:top-6">
//       {/* <AccordionItem
//         icon={Package}
//         title="Product Details"
//         open={open === "details"}
//         onToggle={() => toggle("details")}
//       >
//         <ul className="space-y-1.5 text-sm text-ink/60">
//           {highlights.map((h) => (
//             <li key={h} className="flex items-start gap-2">
//               <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
//               {h}
//             </li>
//           ))}
//         </ul>
//       </AccordionItem> */}
//       <div className="px-5 py-4">
//         <h3 className="text-base font-semibold text-ink">Product Details</h3>

//         <p className="mt-3 text-sm leading-relaxed text-ink/60">
//           {product.description}
//         </p>

//         <ul className="mt-4 space-y-2">
//           {product.highlights.map((h) => (
//             <li key={h} className="flex items-start gap-2 text-sm text-ink/60">
//               <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C85A32]" />
//               {h}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <AccordionItem
//         icon={Truck}
//         title="Shipping"
//         open={open === "shipping"}
//         onToggle={() => toggle("shipping")}
//       >
//         <ul className="space-y-1.5 text-sm text-ink/60">
//           <li>Orders are processed within 1–2 business days.</li>
//           <li>Estimated delivery: 3–6 business days domestically.</li>
//           <li>Free shipping on orders over $75.</li>
//         </ul>
//       </AccordionItem>

//       <AccordionItem
//         icon={RotateCcw}
//         title="Return Policy"
//         open={open === "returns"}
//         onToggle={() => toggle("returns")}
//       >
//         <ul className="space-y-1.5 text-sm text-ink/60">
//           <li>30-day return window from the delivery date.</li>
//           <li>Items must be unworn and unwashed.</li>
//           <li>Original tags must remain attached.</li>
//         </ul>
//       </AccordionItem>
//     </div>
//   );
// }

function ProductAccordions({ product }: { product: ProductDetail }) {
  const [open, setOpen] = useState<"shipping" | "returns" | null>(null);

  const toggle = (key: "shipping" | "returns") => {
    setOpen((cur) => (cur === key ? null : key));
  };

  return (
    <div className="h-fit divide-y divide-ink/8 rounded-2xl border border-ink/8 bg-white sm:sticky sm:top-6">
      {/* Product Details - Always Open */}
      <div className="px-5 py-4">
        <h3 className="text-base font-semibold text-ink">Product Details</h3>

        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          {product.description}
        </p>

        <ul className="mt-4 space-y-2">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-ink/60">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C85A32]" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping - Open / Close */}
      <AccordionItem
        icon={Truck}
        title="Shipping"
        open={open === "shipping"}
        onToggle={() => toggle("shipping")}
      >
        <ul className="space-y-1.5 text-sm text-ink/60">
          <li>Orders are processed within 1–2 business days.</li>
          <li>Estimated delivery: 3–6 business days domestically.</li>
          <li>Free shipping on orders over $75.</li>
        </ul>
      </AccordionItem>

      {/* Return Policy - Open / Close */}
      <AccordionItem
        icon={RotateCcw}
        title="Return Policy"
        open={open === "returns"}
        onToggle={() => toggle("returns")}
      >
        <ul className="space-y-1.5 text-sm text-ink/60">
          <li>30-day return window from the delivery date.</li>
          <li>Items must be unworn and unwashed.</li>
          <li>Original tags must remain attached.</li>
        </ul>
      </AccordionItem>
    </div>
  );
}

function AccordionItem({
  icon: Icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon size={15} strokeWidth={1.8} />
          </span>
          <span className="text-sm font-semibold text-ink/85">{title}</span>
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2.25}
          className={`shrink-0 text-ink/45 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 pl-[2.6rem]">{children}</div>
      </div>
    </div>
  );
}
