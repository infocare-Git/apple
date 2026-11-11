import type { Lang } from "./format";

/** Every user-facing string in content comes in both languages. */
export type L = { ne: string; en: string };
export const tr = (l: L, lang: Lang) => l[lang];

export type TopicId = "orchard" | "pruning" | "highdensity" | "propagation" | "processing";
export type Season = "spring" | "summer" | "autumn" | "winter";

export type ArticleAction = { kind: "order"; productId: string } | { kind: "ask" } | { kind: "diagnose" };

export type Article = {
  slug: string;
  topic: TopicId;
  /** Bikram Sambat months (1 = Baisakh … 12 = Chaitra) when this applies. */
  months: number[];
  icon: string;
  title: L;
  summary: L;
  /** 3 to 7 one-sentence steps. */
  steps: L[];
  actions: ArticleAction[];
  /** All seed content is PLACEHOLDER until a NAFHA/horticulture expert approves it. */
  placeholder: true;
};

export type SymptomKind = "fungal" | "bacterial" | "viral" | "lichen" | "nutrient" | "chewing" | "sucking" | "borer" | "grub";

export type Symptom = {
  id: string;
  kind: SymptomKind;
  icon: string;
  name: L;
  signs: L;
  lifeCycle: L;
  damage: L;
  hosts: L;
  cultural: L;
  organic: L;
  /** Chemical options come ONLY from the products table. */
  chemicalProductIds: string[];
  placeholder: true;
};

export type ProductCategory = "saplings" | "fertilizer" | "protection" | "tools" | "packaging";
export type Regulatory = "normal" | "restricted" | "banned";

export type ChemicalInfo = {
  activeIngredient: L;
  /** null = not yet approved by an expert. The app then shows "pending expert review", never a guess. */
  dose: L | null;
  preHarvestDays: number | null;
  gear: L;
};

export type Product = {
  id: string;
  category: ProductCategory;
  icon: string;
  name: L;
  unit: L;
  priceNpr: number;
  supplierId: string;
  regulatory: Regulatory;
  chemical?: ChemicalInfo;
  placeholder: true;
};

export type Place = { id: string; name: L };
export type CollectionPoint = Place & { palikaId: string };
export type Supplier = { id: string; name: L; palikaId: string };
export type Buyer = { id: string; name: L; kind: "wholesaler" | "collector" | "processor" | "mart"; base: L; phone: string };
export type DirectoryEntry = { id: string; kind: "agrovet" | "nursery" | "bank" | "insurer" | "cooperative" | "coldstore" | "government"; name: L; place: L; phone: string };

export type CalendarTask = { month: number; icon: string; title: L; detail: L; articleSlug?: string };

export type Variety = { id: string; name: L; color: string };
export type Grade = "A" | "B" | "C";
