import { Globe, Scale } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { COUNTRIES, LEGAL_CATEGORIES } from "@/lib/dlaw-options";

export type SelectorsValue = {
  country: string;
  customCountry: string;
  category: string;
};

export function resolveCountry(v: SelectorsValue): string {
  if (v.country === "Other / Custom") {
    return v.customCountry.trim() || "Global / International";
  }
  return v.country;
}

export function SelectorsBar({
  value,
  onChange,
  className = "",
}: {
  value: SelectorsValue;
  onChange: (v: SelectorsValue) => void;
  className?: string;
}) {
  const showCustom = value.country === "Other / Custom";
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5 min-w-0">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select
          value={value.country}
          onValueChange={(v) => onChange({ ...value, country: v })}
        >
          <SelectTrigger className="h-9 w-[170px] sm:w-[200px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showCustom && (
          <Input
            value={value.customCountry}
            onChange={(e) => onChange({ ...value, customCountry: e.target.value })}
            placeholder="Type country / region"
            className="h-9 w-[160px]"
          />
        )}
      </div>

      <div className="flex items-center gap-1.5 min-w-0">
        <Scale className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select
          value={value.category}
          onValueChange={(v) => onChange({ ...value, category: v })}
        >
          <SelectTrigger className="h-9 w-[180px] sm:w-[220px]">
            <SelectValue placeholder="Legal category" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {LEGAL_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
