import { useEffect, useRef, useState } from "react";
import { useCart } from "../pages/Cart";
// import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Heart,
  ShoppingBag,
  User,
  Baby,
  PersonStanding,
} from "lucide-react";

/**
 * Navbar — modern storefront navigation matching the PreferenceFlow
 * design language (cream surface, terracotta accent, serif wordmark).
 *
 * Drop-in requirements:
 *  - Tailwind CSS with these tokens in tailwind.config.js:
 *      colors: { cream: "#FBF6EF", ink: "#241C15", accent: "#D65A34" }
 *      fontFamily: { serif: ["Fraunces", "ui-serif", "Georgia"], sans: ["Inter", "ui-sans-serif"] }
 *  - lucide-react for icons.
 *
 * Usage:
 *   <Navbar cartCount={2} onNavigate={(id) => router.push(`/${id}`)} />
 */

export interface CategoryItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  blurb: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "men", label: "Man", icon: User, blurb: "Shirts, shoes & bags" },
  {
    id: "women",
    label: "Women",
    icon: PersonStanding,
    blurb: "Dresses, shoes & bags",
  },
  { id: "child", label: "Child", icon: Baby, blurb: "Everyday kidswear" },
];

interface NavLinkItem {
  id: string;
  label: string;
  path: string;
}

const PRIMARY_LINKS: NavLinkItem[] = [
  { id: "all-products", label: "All Products", path: "/shop" },

  // NEW nav item — click করলে Onboarding (/)-এ যাবে
  {
    id: "find-perfect-fit",
    label: "Find Your Perfect Fit",
    path: "/",
  },
];

interface NavbarProps {
  brand?: string;
  cartCount?: number;
  wishlistCount?: number;
  activeId?: string;
  onNavigate?: (id: string) => void;
  // onSearch?: () => void;
}

export default function Navbar({
  brand = "StyleHub",
  cartCount = 0,
  wishlistCount = 0,
  activeId,
  onNavigate,
  // onSearch,
}: NavbarProps) {
  const { openCart } = useCart();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  //search bar er jonno
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    // lock body scroll while the mobile sheet is open
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const go = (id: string) => {
    onNavigate?.(id);
    setCategoriesOpen(false);
    setMobileOpen(false);
    setMobileCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-cream/85 backdrop-blur-md">
      {/* announcement strip — optional, mirrors the storefront reference */}
      <div className="bg-accent/12 py-1.5 text-center text-[11px] font-medium tracking-wide text-accent">
        Free shipping on orders over $75
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        {/* mobile trigger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-accent/40 hover:text-accent lg:hidden"
        >
          <Menu size={18} strokeWidth={1.8} />
        </button>

        {/* =========================
   
    Logo click করলে Home page (/home) এ যাবে
    ========================= */}
        <Link
          to="/home"
          className="shrink-0 flex items-center"
          aria-label="StyleHub Home"
        >
          <img
            src="/images/Logo1.jpg"
            alt="StyleHub"
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {PRIMARY_LINKS.map((link) => (
            // <button
            //   key={link.id}
            //   type="button"
            //   onClick={() => go(link.id)}
            //   className={[
            //     "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
            //     activeId === link.id
            //       ? "bg-accent/10 text-accent"
            //       : "text-ink/70 hover:bg-ink/5 hover:text-ink",
            //   ].join(" ")}
            // >
            //   {link.label}
            // </button>

            <Link
              key={link.id}
              to={link.path}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                activeId === link.id
                  ? "bg-accent/10 text-accent"
                  : "text-ink/70 hover:bg-ink/5 hover:text-ink",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={categoriesOpen}
              onClick={() => setCategoriesOpen((v) => !v)}
              className={[
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                categoriesOpen
                  ? "bg-ink/5 text-ink"
                  : "text-ink/70 hover:bg-ink/5 hover:text-ink",
              ].join(" ")}
            >
              Categories
              <ChevronDown
                size={15}
                strokeWidth={2}
                className={`transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={[
                "absolute left-1/2 top-[calc(100%+10px)] w-[19rem] -translate-x-1/2 rounded-2xl border border-ink/8 bg-cream p-2",
                "shadow-[0_20px_40px_-18px_rgba(36,28,21,0.35)] transition-all duration-200 origin-top",
                categoriesOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
              ].join(" ")}
            >
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;

                return (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-accent/8"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/70">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>

                    <span>
                      <span className="block text-sm font-medium text-ink/90">
                        {cat.label}
                      </span>

                      <span className="block text-xs text-ink/45">
                        {cat.blurb}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* <button
            type="button"
            aria-label="Search"
            onClick={onSearch}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <Search size={18} strokeWidth={1.8} />
          </button> */}

          {/* search bar with full activation */}

          <div className="relative flex items-center">
            {searchOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const query = searchQuery.trim();

                  if (!query) return;

                  navigate(`/shop?search=${encodeURIComponent(query)}`);
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2"
              >
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-48 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-accent/50 sm:w-56"
                />
              </form>
            )}

            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Search size={18} strokeWidth={1.8} />
            </button>
          </div>
          {/* search bar with full activation  End*/}
          <button
            type="button"
            aria-label="Wishlist"
            onClick={() => go("wishlist")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <Heart size={18} strokeWidth={1.8} />
            {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
          </button>
          <button
            type="button"
            aria-label="Cart"
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            {cartCount > 0 && <CountBadge count={cartCount} />}
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <div
        className={[
          "fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={[
          "fixed inset-y-0 left-0 z-[70] w-[82%] max-w-xs bg-cream shadow-[20px_0_50px_-20px_rgba(36,28,21,0.5)]",
          "transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/8">
          <span className="font-serif text-xl text-ink">{brand}</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/60"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-4">
          {PRIMARY_LINKS.map((link) => (
            //all product

            <Link
              key={link.id}
              to={link.path}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setMobileCategoriesOpen((v) => !v)}
            aria-expanded={mobileCategoriesOpen}
            className="flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium text-ink/85 transition-colors hover:bg-ink/5"
          >
            Categories
            <ChevronDown
              size={15}
              strokeWidth={2}
              className={`transition-transform duration-300 ${mobileCategoriesOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={[
              "grid overflow-hidden transition-all duration-300 ease-out",
              mobileCategoriesOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            ].join(" ")}
          >
            <div className="min-h-0 flex flex-col gap-1 pl-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => go(`category/${cat.id}`)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent/8"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/70">
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <span className="text-sm font-medium text-ink/85">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-cream">
      {count > 9 ? "9+" : count}
    </span>
  );
}
