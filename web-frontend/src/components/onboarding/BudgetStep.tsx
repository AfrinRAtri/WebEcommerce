import { Tag, Check } from "lucide-react";

export interface BudgetOption {
  id: string;
  label: string;
  min: number;
  /** null = no upper bound */
  max: number | null;
}

export const DEFAULT_BUDGETS: BudgetOption[] = [
  { id: "u25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 - $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
  { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
  { id: "a500", label: "Above $500", min: 500, max: null },
];

interface BudgetStepProps {
  budgets?: BudgetOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function BudgetStep({
  budgets = DEFAULT_BUDGETS,
  selected,
  onSelect,
}: BudgetStepProps) {
  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      <header className="text-center space-y-2">
        <h1 className="font-serif text-[28px] sm:text-4xl leading-tight text-ink tracking-tight">
          What's your budget?
        </h1>
        <p className="text-sm text-ink/55 max-w-[20rem] mx-auto">
          This helps us show items within your range.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {budgets.map((b) => {
          const active = selected === b.id;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(b.id)}
              className={[
                "relative rounded-2xl border px-4 py-4 sm:py-5 text-sm sm:text-base font-medium text-left",
                "transition-all duration-300 ease-out active:scale-[0.97]",
                active
                  ? "border-transparent bg-accent/8 ring-2 ring-accent text-accent shadow-[0_8px_20px_-8px_rgba(214,90,52,0.45)]"
                  : "border-ink/10 bg-white/70 text-ink/80 hover:border-accent/40 hover:-translate-y-0.5",
              ].join(" ")}
            >
              {b.label}
              {active && (
                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-cream">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-accent/8 px-4 py-3.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Tag size={14} strokeWidth={2} />
        </span>
        <p className="text-[13px] leading-snug text-ink/65">
          We'll personalize your experience based on your budget.
        </p>
      </div>
    </div>
  );
}
