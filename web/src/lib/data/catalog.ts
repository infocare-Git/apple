import type { Product, ChemicalInfo, L, ProductCategory, Regulatory } from "../types";

// PLACEHOLDER catalogue. Prices are sample figures. Regulatory flags are
// examples and must be checked against the Plant Quarantine and Pesticide
// Management Centre list before launch. No chemical dose is filled in:
// dose and pre-harvest interval stay null until an expert approves them.

const GEAR: L = {
  ne: "पन्जा, मास्क, चस्मा र पूरै बाहुला भएको लुगा",
  en: "Gloves, mask, goggles and long-sleeved clothing",
};
const chem = (ai: L): ChemicalInfo => ({ activeIngredient: ai, dose: null, preHarvestDays: null, gear: GEAR });

type Row = [id: string, cat: ProductCategory, icon: string, ne: string, en: string, unitNe: string, unitEn: string, price: number, supplier: string, reg?: Regulatory, chemical?: ChemicalInfo];

const ROWS: Row[] = [
  // Saplings and rootstock (8)
  ["sap-red-delicious", "saplings", "🌱", "रेड डेलिसियस बिरुवा", "Red Delicious sapling", "बोट", "plant", 350, "sup-karnali-nursery"],
  ["sap-golden-delicious", "saplings", "🌱", "गोल्डेन डेलिसियस बिरुवा", "Golden Delicious sapling", "बोट", "plant", 350, "sup-karnali-nursery"],
  ["sap-fuji", "saplings", "🌱", "फुजी बिरुवा", "Fuji sapling", "बोट", "plant", 450, "sup-karnali-nursery"],
  ["sap-gala", "saplings", "🌱", "गाला बिरुवा", "Gala sapling", "बोट", "plant", 450, "sup-sinja-nursery"],
  ["sap-jonagold", "saplings", "🌱", "जोनागोल्ड बिरुवा", "Jonagold sapling", "बोट", "plant", 450, "sup-sinja-nursery"],
  ["sap-mm106", "saplings", "🪴", "एमएम१०६ मूलवृन्त", "MM106 rootstock", "बोट", "plant", 180, "sup-sinja-nursery"],
  ["sap-m9", "saplings", "🪴", "एम९ मूलवृन्त (होचो)", "M9 rootstock (dwarfing)", "बोट", "plant", 220, "sup-karnali-nursery"],
  ["sap-crab-seedling", "saplings", "🪴", "जंगली स्याउ बीउ-मूलवृन्त", "Crab apple seedling rootstock", "बोट", "plant", 80, "sup-sinja-nursery"],
  // Fertiliser and micronutrients (9)
  ["fert-compost", "fertilizer", "🟫", "कम्पोस्ट मल", "Compost", "२५ केजी बोरा", "25 kg bag", 600, "sup-jumla-agrovet"],
  ["fert-vermi", "fertilizer", "🪱", "गड्यौले मल", "Vermicompost", "२५ केजी बोरा", "25 kg bag", 900, "sup-jumla-agrovet"],
  ["fert-urea", "fertilizer", "⚪", "युरिया", "Urea", "५० केजी बोरा", "50 kg bag", 1100, "sup-krishi-sahakari"],
  ["fert-dap", "fertilizer", "⚫", "डीएपी", "DAP", "५० केजी बोरा", "50 kg bag", 2700, "sup-krishi-sahakari"],
  ["fert-potash", "fertilizer", "🔴", "पोटास (एमओपी)", "Potash (MOP)", "५० केजी बोरा", "50 kg bag", 2200, "sup-krishi-sahakari"],
  ["fert-boron", "fertilizer", "🧂", "बोरोन (बोराक्स)", "Boron (borax)", "१ केजी", "1 kg", 450, "sup-jumla-agrovet"],
  ["fert-zinc", "fertilizer", "🧂", "जिंक सल्फेट", "Zinc sulphate", "१ केजी", "1 kg", 380, "sup-jumla-agrovet"],
  ["fert-calcium", "fertilizer", "🥛", "क्याल्सियम नाइट्रेट", "Calcium nitrate", "१ केजी", "1 kg", 320, "sup-tila-agrovet"],
  ["fert-lime", "fertilizer", "⬜", "कृषि चुन", "Agricultural lime", "२५ केजी बोरा", "25 kg bag", 500, "sup-tila-agrovet"],
  // Pest and disease control (10 listed + 1 banned example that must never be listed)
  ["prot-bordeaux", "protection", "🔵", "बोर्डो मिश्रण सामग्री", "Bordeaux mixture kit", "प्याकेट", "pack", 450, "sup-jumla-agrovet", "normal", chem({ ne: "तुतो र चुन", en: "Copper sulphate and lime" })],
  ["prot-copper-oxy", "protection", "🟦", "कपर अक्सिक्लोराइड", "Copper oxychloride", "५०० ग्राम", "500 g", 650, "sup-jumla-agrovet", "normal", chem({ ne: "कपर अक्सिक्लोराइड", en: "Copper oxychloride" })],
  ["prot-hort-oil", "protection", "🛢️", "बागवानी तेल (जाडोको छर्ने)", "Horticultural oil (winter wash)", "१ लिटर", "1 litre", 900, "sup-tila-agrovet", "normal", chem({ ne: "मिनरल तेल", en: "Mineral oil" })],
  ["prot-neem", "protection", "🌿", "निमको तेल", "Neem oil", "५०० मिलि", "500 ml", 700, "sup-jumla-agrovet", "normal"],
  ["prot-trichoderma", "protection", "🦠", "ट्राइकोडर्मा (जैविक)", "Trichoderma (biological)", "१ केजी", "1 kg", 550, "sup-krishi-sahakari", "normal"],
  ["prot-bt", "protection", "🐛", "बीटी (जैविक कीटनाशक)", "Bt (biological insecticide)", "५०० ग्राम", "500 g", 800, "sup-krishi-sahakari", "normal"],
  ["prot-pheromone", "protection", "🪤", "कोडलिङ मोथ फेरोमोन पासो", "Codling moth pheromone trap", "पासो", "trap", 350, "sup-tila-agrovet", "normal"],
  ["prot-sticky", "protection", "🟨", "पहेंलो टाँसिने पासो", "Yellow sticky traps", "१० वटा", "pack of 10", 300, "sup-tila-agrovet", "normal"],
  ["prot-systemic-insecticide", "protection", "⚠️", "प्रणालीगत कीटनाशक (नमूना)", "Systemic insecticide (example)", "२५० मिलि", "250 ml", 1200, "sup-jumla-agrovet", "restricted", chem({ ne: "विज्ञ जाँच बाँकी", en: "Pending expert review" })],
  ["prot-systemic-fungicide", "protection", "⚠️", "प्रणालीगत ढुसीनाशक (नमूना)", "Systemic fungicide (example)", "२५० ग्राम", "250 g", 1100, "sup-tila-agrovet", "restricted", chem({ ne: "विज्ञ जाँच बाँकी", en: "Pending expert review" })],
  ["prot-banned-example", "protection", "⛔", "प्रतिबन्धित विषादी (नमूना)", "Banned pesticide (example)", "१ लिटर", "1 litre", 500, "sup-jumla-agrovet", "banned", chem({ ne: "प्रतिबन्धित", en: "Banned" })],
  // Tools (7)
  ["tool-secateurs", "tools", "✂️", "काटछाँट कैंची", "Pruning secateurs", "वटा", "each", 1200, "sup-tila-agrovet"],
  ["tool-saw", "tools", "🪚", "काटछाँट आरी", "Pruning saw", "वटा", "each", 1500, "sup-tila-agrovet"],
  ["tool-loppers", "tools", "🔧", "लामो बिँडे कैंची", "Long-handled loppers", "वटा", "each", 2200, "sup-tila-agrovet"],
  ["tool-grafting-knife", "tools", "🔪", "कलमी चक्कु", "Grafting knife", "वटा", "each", 800, "sup-sinja-nursery"],
  ["tool-sprayer", "tools", "🎒", "पिठ्यूँमा बोक्ने स्प्रेयर", "Knapsack sprayer", "वटा", "each", 4500, "sup-jumla-agrovet"],
  ["tool-grafting-tape", "tools", "🎗️", "कलमी टेप", "Grafting tape", "रोल", "roll", 250, "sup-sinja-nursery"],
  ["tool-grafting-wax", "tools", "🕯️", "कलमी मैन", "Grafting wax", "२५० ग्राम", "250 g", 300, "sup-sinja-nursery"],
  // Packaging (6)
  ["pack-carton-10", "packaging", "📦", "१० केजी कार्टुन", "10 kg carton", "१० वटा", "pack of 10", 650, "sup-himali-pack"],
  ["pack-carton-20", "packaging", "📦", "२० केजी कार्टुन", "20 kg carton", "१० वटा", "pack of 10", 950, "sup-himali-pack"],
  ["pack-crate", "packaging", "🧺", "प्लास्टिक क्रेट", "Plastic crate", "वटा", "each", 450, "sup-himali-pack"],
  ["pack-trays", "packaging", "🥚", "फल राख्ने ट्रे", "Fruit separator trays", "५० वटा", "pack of 50", 700, "sup-himali-pack"],
  ["pack-foam-net", "packaging", "🕸️", "फोम जाली", "Foam fruit nets", "१०० वटा", "pack of 100", 400, "sup-himali-pack"],
  ["pack-labels", "packaging", "🏷️", "स्याउ साथी लेबल", "Produce labels", "२०० वटा", "pack of 200", 350, "sup-himali-pack"],
];

export const ALL_PRODUCTS: Product[] = ROWS.map(([id, category, icon, ne, en, unitNe, unitEn, priceNpr, supplierId, regulatory = "normal", chemical]) => ({
  id, category, icon, name: { ne, en }, unit: { ne: unitNe, en: unitEn }, priceNpr, supplierId, regulatory, chemical, placeholder: true,
}));

/** Banned products cannot be listed. This is the only list the Shop reads. */
export const LISTED_PRODUCTS: Product[] = ALL_PRODUCTS.filter((p) => p.regulatory !== "banned");

export const productById = (id: string) => LISTED_PRODUCTS.find((p) => p.id === id);

export const CATEGORIES: { id: ProductCategory; icon: string; name: L }[] = [
  { id: "saplings", icon: "🌱", name: { ne: "बिरुवा र मूलवृन्त", en: "Saplings & rootstock" } },
  { id: "fertilizer", icon: "🟫", name: { ne: "मल र सूक्ष्म तत्व", en: "Fertiliser & micronutrients" } },
  { id: "protection", icon: "🛡️", name: { ne: "रोग–कीरा नियन्त्रण", en: "Pest & disease control" } },
  { id: "tools", icon: "✂️", name: { ne: "औजार", en: "Tools" } },
  { id: "packaging", icon: "📦", name: { ne: "प्याकेजिङ", en: "Packaging" } },
];
