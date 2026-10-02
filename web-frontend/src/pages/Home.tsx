import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Eye,
  Truck,
  RotateCcw,
  Headphones,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens
   cream:      #FBF3EC
   cream-deep: #F3E2D3
   ink:        #2B231D
   burnt:      #CC5500  (primary accent — buttons, heading, tags)
   burnt-deep: #A6430A  (hover state)
   sage:       #7C8B6F  (secondary accent — Kids / promo #3)
   dusty-blue: #5E7A8C  (secondary accent — Men / promo #2)
   sand:       #F0DAC6
   muted:      #7A6E64
--------------------------------------------------------- */

/* ---------------------------------------------------------
   IMAGE PATHS — replace these with your own file paths or
   hosted image links. That's the only place images live;
   there is no in-app upload option.
--------------------------------------------------------- */
const IMAGES = {
  hero: "/images/banner2.png",
  categories: {
    men: "/images/men1.png",
    women: "/images/w.png",
    kids: "/images/kids1.png",
  },
  promo: {
    discount: "/images/discounts.png",
    request: "/images/RcVyJ.jpg",
    upcoming: "/images/Fz4V9.jpg",
  },
  products: {
    coat: "/images/shirt.jpg",
    dress: "/images/white  kurti.webp",
    bag: "/images/leather-tote.webp",
    vest: "/images/shoes1.jpg",
  },
};

function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 700ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {children}
    </div>
  );
}

interface ImageBoxProps {
  src: string;
  alt: string;
  ratio?: string;
  rounded?: string;
  zoomOnHover?: boolean;
}

/** Static image display — no upload/change UI. Swap `src` in IMAGES above. */
function ImageBox({
  src,
  alt,
  ratio = "aspect-[4/5]",
  rounded = "rounded-2xl",
  zoomOnHover = true,
}: ImageBoxProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative ${ratio} ${rounded} overflow-hidden border border-[#E7D3BF] bg-[#F3E2D3]`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${
            zoomOnHover
              ? "transition-transform duration-500 group-hover:scale-105"
              : ""
          }`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-3 text-center text-[11px] tracking-wide text-[#A78E77]">
          {alt}
        </div>
      )}
    </div>
  );
}

interface Category {
  name: string;
  tag: string;
  href: string;
  accent: string;
  image: string;
}

interface PromoCard {
  title: string;
  body: string;
  cta: string;
  accent: string;
  image: string;
}

interface Benefit {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

interface Product {
  name: string;
  price: number;
  old: number;
  note: string;
  image: string;
}

const categories: Category[] = [
  {
    name: "Men",
    tag: "Tailored & everyday",
    href: "/shop?category=men",
    accent: "#5E7A8C",
    image: IMAGES.categories.men,
  },
  {
    name: "Women",
    tag: "New arrivals weekly",
    href: "/shop?category=women",
    accent: "#CC5500",
    image: IMAGES.categories.women,
  },
  {
    name: "Kids",
    tag: "Playful & comfortable",
    href: "/shop?category=kids",
    accent: "#7C8B6F",
    image: IMAGES.categories.kids,
  },
];

const promoCards: PromoCard[] = [
  {
    title: "Discount Products",
    body: "Season-end styles, marked down while they last.",
    cta: "View all",
    accent: "#CC5500",
    image: IMAGES.promo.discount,
  },
  {
    title: "Request a Product",
    body: "Can\u2019t find what you need? Tell us and we\u2019ll source it.",
    cta: "Request now",
    accent: "#5E7A8C",
    image: IMAGES.promo.request,
  },
  {
    title: "New & Upcoming",
    body: "A first look at what\u2019s landing next.",
    cta: "Explore",
    accent: "#7C8B6F",
    image: IMAGES.promo.upcoming,
  },
];

const benefits: Benefit[] = [
  { icon: Truck, label: "Free shipping" },
  { icon: RotateCcw, label: "Easy returns" },
  { icon: Headphones, label: "24/7 support" },
  { icon: ShieldCheck, label: "Secure payment" },
  { icon: Sparkles, label: "Quality products" },
];

const products: Product[] = [
  {
    name: "Mens Formal Combo",
    price: 128,
    old: 180,
    note: "Green",
    image: IMAGES.products.coat,
  },
  {
    name: "Silk Slip Dress",
    price: 74,
    old: 98,
    note: "Ivory",
    image: IMAGES.products.dress,
  },
  {
    name: "Womens Bag",
    price: 56,
    old: 80,
    note: "Sand",
    image: IMAGES.products.bag,
  },
  {
    name: "Womens Heel",
    price: 39,
    old: 52,
    note: "Black",
    image: IMAGES.products.vest,
  },
];

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const discount = Math.round(
    ((product.old - product.price) / product.old) * 100,
  );

  return (
    <div className="group">
      <div className="relative">
        <ImageBox src={product.image} alt={product.name} ratio="aspect-[1/1]" />
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label="Wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#2B231D] shadow-sm transition-transform hover:scale-105"
        >
          <Heart
            size={15}
            fill={liked ? "#CC5500" : "none"}
            color={liked ? "#CC5500" : "#2B231D"}
          />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-[#CC5500] px-2.5 py-1 text-[11px] font-medium text-white">
          -{discount}%
        </span>
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 text-[12px] font-medium text-[#2B231D] hover:bg-white">
            <ShoppingBag size={14} /> Add to cart
          </button>
          <button
            onClick={() => onQuickView(product)}
            aria-label="Quick view"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#2B231D] hover:bg-white"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-[14px] text-[#2B231D]">{product.name}</p>
        <p className="text-[12px] text-[#8A7C6E]">{product.note}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-[#2B231D]">
            ${product.price}
          </span>
          <span className="text-[12px] text-[#B2A392] line-through">
            ${product.old}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    // Runs once per mount (page load / reload) — animation plays,
    // settles into place, and does not repeat until the page reloads.
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF3EC] font-sans text-[#2B231D]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

        @keyframes shine {
          0% { background-position: -220% 0; }
          60%, 100% { background-position: 220% 0; }
        }
        .shine-text {
          background-image: linear-gradient(100deg, #A6430A 35%, #FFB88A 50%, #A6430A 65%);
          background-size: 260% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 4.5s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }
        .pulse-soft { animation: pulseSoft 2.6s ease-in-out infinite; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 22s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .shine-text, .pulse-soft, .marquee-track { animation: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FBF3EC] via-[#F7E8DC] to-[#F0DAC6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
          <div
            className="text-center md:text-left"
            style={{
              transition: "opacity 800ms ease-out, transform 800ms ease-out",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <span className="inline-block rounded-full bg-[#F3DCC9] px-4 py-1.5 text-[12px] font-medium tracking-wide text-[#CC5500]">
              NEW SEASON SALE
            </span>
            <h1 className="font-serif-display mt-5 text-4xl leading-tight sm:text-5xl md:text-6xl">
              <span className="shine-text">Up to 50% Off</span>
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[15px] text-[#7A6E64] md:mx-0">
              On selected dresses, shoes &amp; accessories \u2014 for a limited
              time only.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="pulse-soft mt-8 inline-flex items-center gap-2 rounded-full bg-[#CC5500] px-7 py-3.5 text-[15px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(204,85,0,0.6)] transition-colors hover:bg-[#A6430A]"
            >
              Order Now <ArrowRight size={17} />
            </button>
          </div>

          {/* Hero image: enters from the right on load, settles in the
              middle, and stays put. Reloading the page replays it. */}
          {/* <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-3xl">
            <div
              style={{
                transition:
                  "transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 900ms ease-out",
                transform: entered ? "translateX(0)" : "translateX(120%)",
                opacity: entered ? 1 : 0,
                height: "100%",
              }}
            >
              <ImageBox
                src={IMAGES.hero}
                alt="Hero product"
                ratio="aspect-[4/5]"
                rounded="rounded-3xl"
                zoomOnHover={false}
              />
            </div>
          </div> */}

          <div className="relative mx-auto h-[500px] w-full max-w-4xl overflow-hidden rounded-3xl">
            <div
              style={{
                transition:
                  "transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 900ms ease-out",
                transform: entered ? "translateX(0)" : "translateX(120%)",
                opacity: entered ? 1 : 0,
                height: "100%",
                width: "100%",
              }}
            >
              <ImageBox
                src={IMAGES.hero}
                alt="Hero product"
                ratio="h-full w-full"
                rounded="rounded-3xl"
                zoomOnHover={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <Reveal className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif-display text-center text-2xl sm:text-3xl">
          Shop by Category
        </h2>
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
          {categories.map((c) => (
            <a key={c.name} href={c.href} className="group block">
              <ImageBox src={c.image} alt={c.name} ratio="aspect-[3/4]" />
              <div className="mt-3 flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: c.accent }}
                    />
                    <p className="truncate text-[13px] sm:text-[16px]">
                      {c.name}
                    </p>
                  </div>
                  <p className="hidden truncate pl-3 text-[12px] text-[#8A7C6E] sm:block">
                    {c.tag}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-[#CC5500] transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>
          ))}
        </div>
      </Reveal>

      {/* PROMOTIONAL CARDS */}
      <Reveal className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {promoCards.map((p) => (
            <div
              key={p.title}
              className="group overflow-hidden rounded-2xl border border-[#E7D3BF] bg-[#F7E8DC]"
            >
              <div className="h-1" style={{ backgroundColor: p.accent }} />
              <ImageBox
                src={p.image}
                alt={p.title}
                ratio="aspect-[16/9]"
                rounded="rounded-none"
              />
              <div className="p-3 sm:p-5">
                <p className="font-serif-display text-sm sm:text-lg">
                  {p.title}
                </p>
                <p className="mt-1.5 hidden text-[13px] text-[#7A6E64] sm:block">
                  {p.body}
                </p>
                <button
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium sm:mt-4 sm:text-[13px]"
                  style={{ color: p.accent }}
                >
                  {p.cta} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* MARQUEE BENEFITS BAR */}
      <div className="overflow-hidden border-y border-[#E7D3BF] bg-[#F0DAC6] py-3.5">
        <div className="flex w-max marquee-track">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center">
              {benefits.map((b, i) => (
                <div
                  key={`${rep}-${i}`}
                  className="flex items-center gap-2 px-8 text-[13px] text-[#5C5148]"
                >
                  <b.icon size={15} className="text-[#CC5500]" />
                  {b.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING PRODUCTS */}
      <Reveal className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-2xl sm:text-3xl">
            Trending Now
          </h2>
          <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#CC5500]">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.name} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      </Reveal>

      {/* QUICK VIEW MODAL */}
      {quickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          onClick={() => setQuickView(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#FBF3EC] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickView(null)}
              className="absolute right-4 top-4 text-[#7A6E64] hover:text-[#2B231D]"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <ImageBox
              src={quickView.image}
              alt={quickView.name}
              ratio="aspect-[5/6]"
              zoomOnHover={false}
            />
            <p className="font-serif-display mt-4 text-xl">{quickView.name}</p>
            <p className="text-[13px] text-[#8A7C6E]">{quickView.note}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[15px] font-medium">
                ${quickView.price}
              </span>
              <span className="text-[13px] text-[#B2A392] line-through">
                ${quickView.old}
              </span>
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#CC5500] py-3 text-[14px] font-medium text-white hover:bg-[#A6430A]">
              <ShoppingBag size={15} /> Add to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
