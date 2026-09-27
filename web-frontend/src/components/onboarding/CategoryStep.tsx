import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Shirt,
  Footprints,
  ShoppingBag,
  Briefcase,
  Plus,
  type LucideIcon,
} from "lucide-react";

export interface CategoryOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** The 6 categories from the brief. Pass a longer `categories` array to
 *  CategoryStep to add more without touching this component. */
export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "women-dress", label: "Women Dress", icon: Shirt },
  { id: "women-shoes", label: "Women Shoes", icon: Footprints },
  { id: "men-dress", label: "Men Dress", icon: Shirt },
  { id: "men-shoes", label: "Mens Shoes", icon: Footprints },
  { id: "women-bag", label: "Women Bag", icon: ShoppingBag },
  { id: "men-bag", label: "Male Bags", icon: Briefcase },
];

interface CategoryStepProps {
  categories?: CategoryOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  /** Optional trailing "+ More" tile, e.g. to open a full category list */
  onAddMore?: () => void;
}

export default function CategoryStep({
  categories = DEFAULT_CATEGORIES,
  selected,
  onSelect,
  onAddMore,
}: CategoryStepProps) {
  const words = ["Let", "us", "know", "your", "choice"];

  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShimmer(true);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      <header className="text-center space-y-2">
        {/* <img
          src="images/Logo2.png"
          alt="StyleHub"
          className="mx-auto mb-4 h-30 w-auto object-contain"
        /> */}

        <Link to="/home" className="inline-block">
          <img
            src="/images/Logo8.jpg"
            alt="StyleHub"
            // className="mx-auto mb-4 h-30 w-auto object-contain   rounded-full object-cover   border-2   "
            className="mx-auto mb-4 h-25 w-25 rounded-full border-2 border-accent object-contain  border-[#D65A34] "
          />
        </Link>
        {/* <h1 className="font-serif text-[28px] sm:text-4xl leading-tight text-ink tracking-tight text-[#D65A34]">
          Let us know your choice
        </h1> */}

        <motion.h1
          className="font-serif text-[28px] sm:text-4xl leading-tight tracking-tight text-[#D65A34]"
          animate={
            showShimmer
              ? {
                  textShadow: [
                    "0 0 0px rgba(214,90,52,0)",
                    "0 0 10px rgba(214,90,52,0.7)",
                    "0 0 0px rgba(214,90,52,0)",
                  ],
                }
              : undefined
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {words.map((word, index) => (
            <motion.span
              key={word}
              className="inline-block mr-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.5,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <p className="text-sm text-ink/55 max-w-[19rem] mx-auto">
          This will help us show you items you'll love.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = selected === cat.id;
          //   return (
          //     <button
          //       key={cat.id}
          //       type="button"
          //       aria-pressed={active}
          //       onClick={() => onSelect(cat.id)}
          //       className={[
          //         "group relative flex flex-col items-center gap-2.5 rounded-2xl border p-3.5 sm:p-5",
          //         "transition-all duration-300 ease-out active:scale-[0.97]",
          //         active
          //           ? "border-transparent bg-accent/8 ring-2 ring-accent shadow-[0_8px_20px_-8px_rgba(214,90,52,0.45)]"
          //           : "border-ink/10 bg-white/70 hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(36,28,21,0.35)]",
          //       ].join(" ")}
          //     >
          //       <span
          //         className={[
          //           "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-colors duration-300",
          //           active
          //             ? "bg-accent text-cream"
          //             : "bg-ink/[0.06] text-ink/70 group-hover:bg-accent/12 group-hover:text-accent",
          //         ].join(" ")}
          //       >
          //         <Icon size={20} strokeWidth={1.6} />
          //       </span>
          //       <span className="text-[13px] sm:text-sm font-medium text-ink/85 text-center leading-tight">
          //         {cat.label}
          //       </span>
          //     </button>
          //   );

          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(cat.id)}
              className={[
                "group relative flex flex-col items-center gap-2.5 rounded-2xl border p-3.5 sm:p-5",
                "transition-all duration-300 ease-out active:scale-[0.97]",
                active
                  ? "border-[#D65A34] bg-[#D65A34] text-white ring-2 ring-[#D65A34]/30 shadow-[0_8px_20px_-8px_rgba(214,90,52,0.45)]"
                  : "border-ink/10 bg-white/70 hover:border-[#D65A34]/60 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(36,28,21,0.35)]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-colors duration-300",
                  active
                    ? "bg-white text-[#D65A34]"
                    : "bg-ink/[0.06] text-ink/70 group-hover:bg-[#D65A34]/12 group-hover:text-[#D65A34]",
                ].join(" ")}
              >
                <Icon size={20} strokeWidth={1.6} />
              </span>

              <span
                className={[
                  "text-[13px] sm:text-sm font-medium text-center leading-tight",
                  active ? "text-white" : "text-ink/85",
                ].join(" ")}
              >
                {cat.label}
              </span>
            </button>
          );
        })}

        {onAddMore && (
          <button
            type="button"
            onClick={onAddMore}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-ink/20 p-3.5 sm:p-5 text-ink/40 transition-colors duration-300 hover:text-accent hover:border-accent/50"
          >
            <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-ink/[0.06]">
              <Plus size={18} strokeWidth={1.75} />
            </span>
            <span className="text-[13px] sm:text-sm font-medium">More</span>
          </button>
        )}
      </div>

      <p className="text-center text-xs text-ink/35">
        You can change this later in settings.
      </p>
    </div>
  );
}
