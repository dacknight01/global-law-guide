import { COUNTRIES, CATEGORIES } from "@/lib/dlaw-filters";
import { cn } from "@/lib/utils";

type Props = {
  country: string;
  category: string;
  onCountryChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
};

export function Filters({ country, category, onCountryChange, onCategoryChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="sr-only" htmlFor="country-select">Country</label>
        <select
          id="country-select"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max" role="tablist" aria-label="Legal categories">
          {CATEGORIES.map((cat) => {
            const active = cat.code === category;
            return (
              <button
                key={cat.code}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Filter by ${cat.name}`}
                onClick={() => onCategoryChange(cat.code)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-accent",
                )}
              >
                <span className="mr-1" aria-hidden="true">{cat.emoji}</span>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
