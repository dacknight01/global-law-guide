export const LEGAL_CATEGORIES = [
  "Any / General",
  "Criminal Law",
  "Civil Law",
  "Labor & Employment Law",
  "Tax Law",
  "Immigration Law",
  "Property & Real Estate Law",
  "Business & Corporate Law",
  "Consumer Protection Law",
  "Traffic & Road Law",
  "Constitutional Law",
  "Family Law",
  "Intellectual Property Law",
  "Data Privacy Law",
  "Environmental Law",
  "Human Rights Law",
] as const;

export type LegalCategory = (typeof LEGAL_CATEGORIES)[number];

// Curated list of widely-asked-about jurisdictions; "Other" lets users type their own.
export const COUNTRIES = [
  "Global / International",
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina",
  "Brazil", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Georgia",
  "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Libya", "Lithuania",
  "Luxembourg", "Malaysia", "Malta", "Mexico", "Mongolia", "Morocco", "Myanmar", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Korea", "Norway", "Oman",
  "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Singapore",
  "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia",
  "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
  "European Union",
  "Other / Custom",
] as const;

export type Country = string;

export const DEFAULT_COUNTRY = "Global / International";
export const DEFAULT_CATEGORY = "Any / General";
