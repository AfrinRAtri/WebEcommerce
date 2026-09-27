import { Check, ArrowRight } from "lucide-react";

export interface ColorOption {
  id: string;
  label: string;
  /** hex, or a CSS gradient string for swatches like "Multi" */
  swatch: string;
  /** true if the swatch is light and needs a visible ring even when unselected */
  light?: boolean;
}

export const DEFAULT_COLORS: ColorOption[] = [
  { id: "black", label: "Black", swatch: "#1C1B1A" },
  { id: "white", label: "White", swatch: "#FFFFFF", light: true },
  { id: "beige", label: "Beige", swatch: "#D9C3A3" },
  { id: "brown", label: "Brown", swatch: "#7B4B2A" },
  { id: "grey", label: "Grey", swatch: "#B7B4AE" },
  { id: "navy", label: "Navy", swatch: "#1C2B49" },
  { id: "blue", label: "Blue", swatch: "#3169E6" },
  { id: "red", label: "Red", swatch: "#D8362A" },
  { id: "pink", label: "Pink", swatch: "#F17FAE" },
  { id: "green", label: "Green", swatch: "#4C7A3B" },
  { id: "purple", label: "Purple", swatch: "#7C3FA0" },
  { id: "yellow", label: "Yellow", swatch: "#F0C22E" },
  { id: "orange", label: "Orange", swatch: "#EE9012" },
  {
    id: "multi",
    label: "Multi",
    swatch:
      "conic-gradient(from 0deg, #D8362A 0deg 60deg, #EE9012 60deg 120deg, #F0C22E 120deg 180deg, #4C7A3B 180deg 240deg, #3169E6 240deg 300deg, #7C3FA0 300deg 360deg)",
  },
];

interface ColorStepProps {
  colors?: ColorOption[];
  selected: string[];
  onToggle: (id: string) => void;
  onSubmit: () => void;
}

export default function ColorStep({
  colors = DEFAULT_COLORS,
  selected,
  onToggle,
  onSubmit,
}: ColorStepProps) {
  const hasSelection = selected.length > 0;

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      <header className="text-center space-y-2">
        <h1 className="font-serif text-[28px] sm:text-4xl leading-tight text-ink tracking-tight">
          What colors do you love?
        </h1>
        <p className="text-sm text-ink/55 max-w-[19rem] mx-auto">
          Choose your favorite colors.
        </p>
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-3 gap-y-5">
        {colors.map((c) => {
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(c.id)}
              className="group flex flex-col items-center gap-2"
            >
              <span
                className={[
                  "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-transform duration-300",
                  "ring-2 ring-offset-4 ring-offset-cream",
                  active
                    ? "ring-accent scale-105"
                    : c.light
                      ? "ring-ink/15"
                      : "ring-transparent",
                  "group-hover:scale-105 group-active:scale-95",
                ].join(" ")}
                style={{ background: c.swatch }}
              >
                {c.light && (
                  <span className="absolute inset-0 rounded-full border border-ink/10" />
                )}
                {active && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-cream shadow-sm">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="text-[12px] sm:text-[13px] font-medium text-ink/70">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!hasSelection}
        onClick={onSubmit}
        className={[
          "flex items-center justify-center gap-2 rounded-full py-3.5 text-sm sm:text-base font-semibold transition-all duration-300",
          hasSelection
            ? "bg-accent text-cream shadow-[0_10px_24px_-10px_rgba(214,90,52,0.6)] hover:brightness-105 active:scale-[0.98]"
            : "bg-ink/10 text-ink/35 cursor-not-allowed",
        ].join(" ")}
      >
        Show My Items
        <ArrowRight size={17} strokeWidth={2.25} />
      </button>
    </div>
  );
}
