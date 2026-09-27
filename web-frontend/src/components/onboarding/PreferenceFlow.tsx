import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import CategoryStep, {
  DEFAULT_CATEGORIES,
  type CategoryOption,
} from "./CategoryStep";
import BudgetStep, { DEFAULT_BUDGETS, type BudgetOption } from "./BudgetStep";
import ColorStep, { DEFAULT_COLORS, type ColorOption } from "./ColorStep";
import ProductResultStep, {
  DEMO_PRODUCTS,
  type Product,
  type Selections,
} from "./ProductResultStep";

/**
 * PreferenceFlow — a 3-step preference quiz (category → budget → color)
 * that ends on a matched-products screen, with a "Skip" escape hatch to
 * the storefront at every step.
 *
 * Drop-in requirements:
 *  - Tailwind CSS, with these theme tokens added to tailwind.config.js:
 *      colors: { cream: "#FBF6EF", ink: "#241C15", accent: "#D65A34" }
 *      fontFamily: { serif: ["Fraunces", "ui-serif", "Georgia"], sans: ["Inter", "ui-sans-serif"] }
 *  - lucide-react for icons.
 *
 * Usage:
 *   <PreferenceFlow onFinish={() => router.push("/home")} />
 */

const STEP_LABELS = ["Category", "Budget", "Colors"] as const;

interface PreferenceFlowProps {
  categories?: CategoryOption[];
  budgets?: BudgetOption[];
  colors?: ColorOption[];
  products?: Product[];
  /** Called on Skip, or after "Explore More" on the results screen. */
  onFinish: () => void;
}

export default function PreferenceFlow({
  categories = DEFAULT_CATEGORIES,
  budgets = DEFAULT_BUDGETS,
  colors = DEFAULT_COLORS,
  products = DEMO_PRODUCTS,
  onFinish,
}: PreferenceFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 category, 1 budget, 2 color, 3 result
  const [selections, setSelections] = useState<Selections>({
    category: null,
    budget: null,
    colors: [],
  });
  const [popularOverride, setPopularOverride] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const goTo = (next: number) => {
    setAnimKey((k) => k + 1);
    setStep(next);
  };

  const selectCategory = (id: string) => {
    setSelections((s) => ({ ...s, category: id }));
    setTimeout(() => goTo(1), 220);
  };

  const selectBudget = (id: string) => {
    setSelections((s) => ({ ...s, budget: id }));
    setTimeout(() => goTo(2), 220);
  };

  const toggleColor = (id: string) => {
    setSelections((s) => ({
      ...s,
      colors: s.colors.includes(id)
        ? s.colors.filter((c) => c !== id)
        : [...s.colors, id],
    }));
  };

  const activeColorHex = useMemo(() => {
    const last = selections.colors[selections.colors.length - 1];
    const found = colors.find((c) => c.id === last);
    return found && !found.swatch.startsWith("conic")
      ? found.swatch
      : "#D65A34";
  }, [selections.colors, colors]);

  const effectiveProducts = popularOverride
    ? products.filter((p) => p.popular)
    : products;

  const showBack = step > 0;
  const showDots = step < 3;

  const handleShowMyItems = () => {
    sessionStorage.setItem("stylehub_preferences", JSON.stringify(selections));

    navigate("/shop?recommended=true");
  };

  return (
    <div className="relative mx-auto mt-40 flex min-h-[640px] w-[95%] max-w-2xl flex-col overflow-hidden rounded-[28px] border border-ink/8 bg-cream shadow-[0_30px_60px_-25px_rgba(36,28,21,0.35)]">
      {/* ambient glow that tracks the chosen accent color */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl transition-colors duration-700 ease-out"
        style={{ backgroundColor: activeColorHex, opacity: 0.16 }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl transition-colors duration-700 ease-out"
        style={{ backgroundColor: activeColorHex, opacity: 0.1 }}
      />

      {/* top bar */}
      <div className="relative flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-6">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, step - 1))}
          aria-label="Go back"
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink/60 transition-opacity duration-200",
            showBack ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <ChevronLeft size={16} strokeWidth={2.25} />
        </button>

        <div
          className={[
            "flex items-center gap-1.5 transition-opacity duration-200",
            showDots ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                i === step
                  ? "w-6 bg-accent"
                  : i < step
                    ? "w-1.5 bg-accent/50"
                    : "w-1.5 bg-ink/12",
              ].join(" ")}
            />
          ))}
        </div>

        {/* <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink/60 transition-colors hover:border-accent/40 hover:text-accent"
        >
          Skip →
        </button> */}

        {/* skip button */}

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink/60 transition-colors hover:border-accent/40 hover:text-accent"
        >
          Skip →
        </button>
      </div>

      {/* step content */}
      <div className="relative flex-1 px-5 pb-7 pt-6 sm:px-7 sm:pb-8">
        <div key={animKey} className="pf-enter">
          {step === 0 && (
            <CategoryStep
              categories={categories}
              selected={selections.category}
              onSelect={selectCategory}
            />
          )}

          {step === 1 && (
            <BudgetStep
              budgets={budgets}
              selected={selections.budget}
              onSelect={selectBudget}
            />
          )}

          {step === 2 && (
            <ColorStep
              colors={colors}
              selected={selections.colors}
              onToggle={toggleColor}
              // onSubmit={() => goTo(3)}
              onSubmit={handleShowMyItems}
            />
          )}

          {step === 3 && (
            <ProductResultStep
              selections={selections}
              categories={categories}
              budgets={budgets}
              colorOptions={colors}
              products={effectiveProducts}
              onRemoveCategory={() =>
                setSelections((s) => ({ ...s, category: null }))
              }
              onRemoveBudget={() =>
                setSelections((s) => ({ ...s, budget: null }))
              }
              onRemoveColor={(id) =>
                setSelections((s) => ({
                  ...s,
                  colors: s.colors.filter((c) => c !== id),
                }))
              }
              onClearAll={() => {
                setSelections({ category: null, budget: null, colors: [] });
                setPopularOverride(false);
              }}
              onAdjustPreferences={() => {
                setPopularOverride(false);
                goTo(0);
              }}
              onShowPopular={() => setPopularOverride(true)}
              onExploreMore={onFinish}
            />
          )}
        </div>
      </div>

      <style>{`
        .pf-enter { animation: pf-fade-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes pf-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-enter { animation: none; }
        }
      `}</style>
    </div>
  );
}
