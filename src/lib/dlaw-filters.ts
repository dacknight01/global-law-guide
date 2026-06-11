export type CountryOption = { code: string; name: string; flag: string };

export const COUNTRIES: CountryOption[] = [
  { code: "global", name: "Global", flag: "🌍" },
  { code: "nigeria", name: "Nigeria", flag: "🇳🇬" },
  { code: "usa", name: "USA", flag: "🇺🇸" },
  { code: "uk", name: "UK", flag: "🇬🇧" },
  { code: "canada", name: "Canada", flag: "🇨🇦" },
  { code: "australia", name: "Australia", flag: "🇦🇺" },
  { code: "india", name: "India", flag: "🇮🇳" },
  { code: "germany", name: "Germany", flag: "🇩🇪" },
  { code: "france", name: "France", flag: "🇫🇷" },
  { code: "south-africa", name: "South Africa", flag: "🇿🇦" },
];

export const DEFAULT_COUNTRY = "global";

export type CategoryOption = { code: string; name: string; emoji: string };

export const CATEGORIES: CategoryOption[] = [
  { code: "all", name: "All", emoji: "✨" },
  { code: "housing", name: "Housing Law", emoji: "🏠" },
  { code: "police", name: "Police Rights", emoji: "🚓" },
  { code: "work", name: "Work Rights", emoji: "💼" },
  { code: "criminal", name: "Criminal Law", emoji: "⚖️" },
  { code: "family", name: "Family Law", emoji: "👨‍👩‍👧" },
  { code: "human-rights", name: "Human Rights", emoji: "📜" },
  { code: "consumer", name: "Consumer Rights", emoji: "🛒" },
  { code: "immigration", name: "Immigration", emoji: "🛂" },
  { code: "traffic", name: "Traffic & Driving", emoji: "🚗" },
];

export const DEFAULT_CATEGORY = "all";

export function countryByCode(code: string): CountryOption {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function categoryByCode(code: string): CategoryOption {
  return CATEGORIES.find((c) => c.code === code) ?? CATEGORIES[0];
}

export const DISCLAIMER =
  "D-Law is an independent educational platform and is not affiliated with any government or legal authority.";
