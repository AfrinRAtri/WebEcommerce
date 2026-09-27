import { Heart, X, ArrowRight, PackageSearch } from "lucide-react";
import type { CategoryOption } from "./CategoryStep";
import type { BudgetOption } from "./BudgetStep";
import type { ColorOption } from "./ColorStep";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // CategoryOption.id
  colors: string[]; // ColorOption.id[]
  popular?: boolean;
  /** Tailwind gradient classes used as an image placeholder */
  art: string;
}

/** Small demo catalog. Swap for real product data / an API call. */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Floral Midi Dress",
    price: 85,
    category: "women-dress",
    colors: ["beige", "brown"],
    popular: true,
    art: "from-[#e8b98f] to-[#c98a5c]",
  },
  {
    id: "p2",
    name: "Black Elegant Dress",
    price: 78,
    category: "women-dress",
    colors: ["black"],
    popular: true,
    art: "from-[#4a4a4a] to-[#1c1b1a]",
  },
  {
    id: "p3",
    name: "Pink Summer Dress",
    price: 65,
    category: "women-dress",
    colors: ["pink"],
    art: "from-[#f6b9d3] to-[#ef86ae]",
  },
  {
    id: "p4",
    name: "Black Maxi Dress",
    price: 95,
    category: "women-dress",
    colors: ["black"],
    art: "from-[#3a3a3a] to-[#0f0f0f]",
  },
  {
    id: "p5",
    name: "Classic Court Heels",
    price: 72,
    category: "women-shoes",
    colors: ["beige", "brown"],
    popular: true,
    art: "from-[#d9c3a3] to-[#a9825a]",
  },
  {
    id: "p6",
    name: "Oxford Dress Shirt",
    price: 58,
    category: "men-dress",
    colors: ["blue", "navy"],
    art: "from-[#8fb4ee] to-[#3f6fd6]",
  },
  {
    id: "p7",
    name: "Leather Derby Shoes",
    price: 110,
    category: "men-shoes",
    colors: ["brown"],
    art: "from-[#9a6a41] to-[#5c3a1f]",
  },
  {
    id: "p8",
    name: "Structured Tote Bag",
    price: 89,
    category: "women-bag",
    colors: ["pink", "beige"],
    popular: true,
    art: "from-[#f1cbd8] to-[#e79bb4]",
  },
  {
    id: "p9",
    name: "Everyday Backpack",
    price: 62,
    category: "men-bag",
    colors: ["black", "grey"],
    art: "from-[#6d6d6d] to-[#242322]",
  },
  {
    id: "p10",
    name: "Suede Ankle Boots",
    price: 132,
    category: "women-shoes",
    colors: ["black"],
    art: "from-[#4a4a4a] to-[#1c1b1a]",
  },
];

export interface Selections {
  category: string | null;
  budget: string | null;
  colors: string[];
}

interface ProductResultStepProps {
  selections: Selections;
  categories: CategoryOption[];
  budgets: BudgetOption[];
  colorOptions: ColorOption[];
  products?: Product[];
  onRemoveCategory: () => void;
  onRemoveBudget: () => void;
  onRemoveColor: (id: string) => void;
  onClearAll: () => void;
  onAdjustPreferences: () => void;
  onShowPopular: () => void;
  onExploreMore: () => void;
}

function matches(
  product: Product,
  selections: Selections,
  budgets: BudgetOption[],
) {
  if (selections.category && product.category !== selections.category)
    return false;
  if (selections.budget) {
    const b = budgets.find((x) => x.id === selections.budget);
    if (
      b &&
      (product.price < b.min || (b.max !== null && product.price > b.max))
    )
      return false;
  }
  if (
    selections.colors.length > 0 &&
    !product.colors.some((c) => selections.colors.includes(c))
  )
    return false;
  return true;
}

export default function ProductResultStep({
  selections,
  categories,
  budgets,
  colorOptions,
  products = DEMO_PRODUCTS,
  onRemoveCategory,
  onRemoveBudget,
  onRemoveColor,
  onClearAll,
  onAdjustPreferences,
  onShowPopular,
  onExploreMore,
}: ProductResultStepProps) {
  const results = products.filter((p) => matches(p, selections, budgets));
  const hasFilters = Boolean(
    selections.category || selections.budget || selections.colors.length,
  );
  const categoryLabel = categories.find(
    (c) => c.id === selections.category,
  )?.label;
  const budgetLabel = budgets.find((b) => b.id === selections.budget)?.label;

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-7 text-center">
        <header className="space-y-2">
          <h1 className="font-serif text-[26px] sm:text-4xl leading-tight text-ink tracking-tight">
            Oops! No items match
            <br className="hidden sm:block" /> your preferences.
          </h1>
          <p className="text-sm text-ink/55 max-w-[22rem] mx-auto">
            Try adjusting your choices for more results.
          </p>
        </header>

        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-accent/8">
          <div className="absolute inset-3 rounded-full bg-accent/10" />
          <PackageSearch
            size={44}
            strokeWidth={1.3}
            className="relative text-accent/70"
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAdjustPreferences}
            className="rounded-full border border-ink/15 py-3 text-sm font-semibold text-ink/75 transition-colors hover:border-accent/50 hover:text-accent"
          >
            Adjust Preferences
          </button>
          <button
            type="button"
            onClick={onShowPopular}
            className="rounded-full bg-accent py-3 text-sm font-semibold text-cream shadow-[0_10px_24px_-10px_rgba(214,90,52,0.6)] transition hover:brightness-105 active:scale-[0.98]"
          >
            Show Popular Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center space-y-2">
        <h1 className="font-serif text-[28px] sm:text-4xl leading-tight text-ink tracking-tight">
          Here are some picks for you!
        </h1>
        <p className="text-sm text-ink/55">Based on your choices</p>
      </header>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {categoryLabel && (
            <Chip label={categoryLabel} onRemove={onRemoveCategory} />
          )}
          {budgetLabel && (
            <Chip label={budgetLabel} onRemove={onRemoveBudget} />
          )}
          {selections.colors.map((id) => {
            const label = colorOptions.find((c) => c.id === id)?.label ?? id;
            return (
              <Chip key={id} label={label} onRemove={() => onRemoveColor(id)} />
            );
          })}
          <button
            type="button"
            onClick={onClearAll}
            className="ml-1 text-xs font-medium text-ink/40 underline-offset-2 hover:text-accent hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {results.map((p) => (
          <article
            key={p.id}
            className="group overflow-hidden rounded-2xl border border-ink/8 bg-white/70 transition-shadow duration-300 hover:shadow-[0_14px_28px_-16px_rgba(36,28,21,0.35)]"
          >
            <div
              className={`relative aspect-[4/5] w-full bg-gradient-to-br ${p.art}`}
            >
              <button
                type="button"
                aria-label="Save"
                className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-ink/60 backdrop-blur transition-colors hover:text-accent"
              >
                <Heart size={14} strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-0.5 px-3 py-2.5">
              <p className="truncate text-[13px] font-medium text-ink/85">
                {p.name}
              </p>
              <p className="text-[13px] font-semibold text-accent">
                ${p.price.toFixed(2)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onExploreMore}
        className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm sm:text-base font-semibold text-cream transition hover:brightness-110 active:scale-[0.98]"
      >
        Explore More
        <ArrowRight size={17} strokeWidth={2.25} />
      </button>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/6 px-3 py-1.5 text-xs font-medium text-ink/70">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-ink/40 hover:text-accent"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}
