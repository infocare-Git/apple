import type { Buyer, CalendarTask, CollectionPoint, DirectoryEntry, L, Place, Supplier, Variety } from "../types";

// Pilot district seed data (Jumla). Names of collection points, suppliers,
// buyers and directory entries are FICTIONAL samples for the demo, and the
// phone numbers are fake (98000000xx).

const l = (ne: string, en: string): L => ({ ne, en });

export const DISTRICT: Place = { id: "jumla", name: l("जुम्ला", "Jumla") };
/** Centre of Jumla bazaar, used for the weather forecast. */
export const DISTRICT_COORDS = { lat: 29.274, lon: 82.183 };

export const PALIKAS: Place[] = [
  { id: "chandannath", name: l("चन्दननाथ नगरपालिका", "Chandannath Municipality") },
  { id: "sinja", name: l("सिंजा गाउँपालिका", "Sinja Rural Municipality") },
  { id: "tila", name: l("तिला गाउँपालिका", "Tila Rural Municipality") },
];

export const COLLECTION_POINTS: CollectionPoint[] = [
  { id: "cp-khalanga", palikaId: "chandannath", name: l("खलङ्गा बजार केन्द्र", "Khalanga Bazaar point") },
  { id: "cp-chandannath-6", palikaId: "chandannath", name: l("चन्दननाथ–६ सहकारी भवन", "Chandannath-6 cooperative hall") },
  { id: "cp-sinja-ward1", palikaId: "sinja", name: l("सिंजा–१ स्कूल चौर", "Sinja-1 school ground") },
  { id: "cp-sinja-bazar", palikaId: "sinja", name: l("सिंजा बजार केन्द्र", "Sinja Bazaar point") },
  { id: "cp-tila-ward3", palikaId: "tila", name: l("तिला–३ वडा कार्यालय", "Tila-3 ward office") },
  { id: "cp-tila-river", palikaId: "tila", name: l("तिला नदी किनार गोदाम", "Tila riverside store") },
];

export const FARMER_GROUPS = [
  { id: "grp-chandannath", name: l("चन्दननाथ स्याउ कृषक समूह", "Chandannath Apple Farmers' Group"), palikaId: "chandannath", members: 12 },
  { id: "grp-sinja", name: l("सिंजा उपत्यका फलफूल समूह", "Sinja Valley Fruit Group"), palikaId: "sinja", members: 8 },
];

export const SUPPLIERS: Supplier[] = [
  { id: "sup-jumla-agrovet", name: l("जुम्ला एग्रोभेट", "Jumla Agrovet"), palikaId: "chandannath" },
  { id: "sup-tila-agrovet", name: l("तिला कृषि पसल", "Tila Krishi Pasal"), palikaId: "tila" },
  { id: "sup-krishi-sahakari", name: l("कर्णाली कृषि सहकारी", "Karnali Krishi Cooperative"), palikaId: "chandannath" },
  { id: "sup-karnali-nursery", name: l("कर्णाली फलफूल नर्सरी", "Karnali Fruit Nursery"), palikaId: "chandannath" },
  { id: "sup-sinja-nursery", name: l("सिंजा नर्सरी", "Sinja Nursery"), palikaId: "sinja" },
  { id: "sup-himali-pack", name: l("हिमाली प्याकेजिङ", "Himali Packaging"), palikaId: "chandannath" },
];
export const supplierById = (id: string) => SUPPLIERS.find((s) => s.id === id);

export const BUYERS: Buyer[] = [
  { id: "buy-kalimati-1", kind: "wholesaler", name: l("हिमाल फ्रुट्स थोक", "Himal Fruits Wholesale"), base: l("कालीमाटी, काठमाडौं", "Kalimati, Kathmandu"), phone: "9800000011" },
  { id: "buy-kalimati-2", kind: "wholesaler", name: l("सगरमाथा फलफूल", "Sagarmatha Fruits"), base: l("कालीमाटी, काठमाडौं", "Kalimati, Kathmandu"), phone: "9800000012" },
  { id: "buy-nepalgunj", kind: "wholesaler", name: l("भेरी थोक बजार", "Bheri Wholesale"), base: l("नेपालगन्ज", "Nepalgunj"), phone: "9800000013" },
  { id: "buy-collector-1", kind: "collector", name: l("कर्णाली स्याउ सङ्कलक", "Karnali Apple Collectors"), base: l("खलङ्गा, जुम्ला", "Khalanga, Jumla"), phone: "9800000014" },
  { id: "buy-collector-2", kind: "collector", name: l("सिंजा ढुवानी तथा सङ्कलन", "Sinja Transport & Collection"), base: l("सिंजा, जुम्ला", "Sinja, Jumla"), phone: "9800000015" },
  { id: "buy-processor", kind: "processor", name: l("जुम्ला जुस उद्योग", "Jumla Juice Industries"), base: l("चन्दननाथ, जुम्ला", "Chandannath, Jumla"), phone: "9800000016" },
  { id: "buy-mart-1", kind: "mart", name: l("सुपथ मार्ट", "Supath Mart"), base: l("ललितपुर", "Lalitpur"), phone: "9800000017" },
  { id: "buy-mart-2", kind: "mart", name: l("सुर्खेत ताजा पसल", "Surkhet Fresh Store"), base: l("बीरेन्द्रनगर", "Birendranagar"), phone: "9800000018" },
];
export const buyerById = (id: string) => BUYERS.find((b) => b.id === id);

export const BUYER_KIND: Record<Buyer["kind"], L> = {
  wholesaler: l("थोक व्यापारी", "Wholesaler"),
  collector: l("सङ्कलक", "Collector"),
  processor: l("प्रशोधक", "Processor"),
  mart: l("मार्ट", "Mart"),
};

export const DIRECTORY: DirectoryEntry[] = [
  { id: "dir-agrovet-1", kind: "agrovet", name: l("जुम्ला एग्रोभेट", "Jumla Agrovet"), place: l("खलङ्गा", "Khalanga"), phone: "9800000021" },
  { id: "dir-agrovet-2", kind: "agrovet", name: l("तिला कृषि पसल", "Tila Krishi Pasal"), place: l("तिला", "Tila"), phone: "9800000022" },
  { id: "dir-nursery-1", kind: "nursery", name: l("कर्णाली फलफूल नर्सरी", "Karnali Fruit Nursery"), place: l("चन्दननाथ", "Chandannath"), phone: "9800000023" },
  { id: "dir-nursery-2", kind: "nursery", name: l("सिंजा नर्सरी", "Sinja Nursery"), place: l("सिंजा", "Sinja"), phone: "9800000024" },
  { id: "dir-bank", kind: "bank", name: l("कृषि विकास बैंक (नमूना शाखा)", "Agricultural Development Bank (sample branch)"), place: l("खलङ्गा", "Khalanga"), phone: "9800000025" },
  { id: "dir-insurer", kind: "insurer", name: l("बाली बीमा एजेन्ट (नमूना)", "Crop insurance agent (sample)"), place: l("खलङ्गा", "Khalanga"), phone: "9800000026" },
  { id: "dir-coop", kind: "cooperative", name: l("कर्णाली कृषि सहकारी", "Karnali Krishi Cooperative"), place: l("चन्दननाथ", "Chandannath"), phone: "9800000027" },
  { id: "dir-cold", kind: "coldstore", name: l("जुम्ला शीत भण्डार (नमूना)", "Jumla cold store (sample)"), place: l("चन्दननाथ", "Chandannath"), phone: "9800000028" },
  { id: "dir-gov-1", kind: "government", name: l("कृषि ज्ञान केन्द्र (नमूना)", "Agriculture Knowledge Centre (sample)"), place: l("खलङ्गा", "Khalanga"), phone: "9800000029" },
  { id: "dir-gov-2", kind: "government", name: l("बागवानी केन्द्र (नमूना)", "Horticulture Centre (sample)"), place: l("जुम्ला", "Jumla"), phone: "9800000030" },
];

export const DIRECTORY_KIND: Record<DirectoryEntry["kind"], L> = {
  agrovet: l("एग्रोभेट", "Agrovets"),
  nursery: l("नर्सरी", "Nurseries"),
  bank: l("बैंक", "Banks"),
  insurer: l("बीमा", "Insurers"),
  cooperative: l("सहकारी", "Cooperatives"),
  coldstore: l("शीत भण्डार", "Cold storage"),
  government: l("सरकारी कार्यालय", "Government offices"),
};

export const VARIETIES: Variety[] = [
  { id: "red-delicious", name: l("रेड डेलिसियस", "Red Delicious"), color: "#B71C1C" },
  { id: "royal-delicious", name: l("रोयल डेलिसियस", "Royal Delicious"), color: "#8E1B1B" },
  { id: "golden-delicious", name: l("गोल्डेन डेलिसियस", "Golden Delicious"), color: "#E0B000" },
  { id: "fuji", name: l("फुजी", "Fuji"), color: "#D9534F" },
  { id: "gala", name: l("गाला", "Gala"), color: "#E5633F" },
  { id: "local", name: l("स्थानीय जात", "Local variety"), color: "#7CB342" },
];
export const varietyById = (id: string) => VARIETIES.find((v) => v.id === id);

/**
 * SAMPLE reference prices (NPR per kg) by variety, grade A. Grade B and C are
 * derived. Replace with a live Kalimati market feed before launch.
 */
export const REFERENCE_PRICE: Record<string, { kathmandu: number; local: number }> = {
  "red-delicious": { kathmandu: 190, local: 110 },
  "royal-delicious": { kathmandu: 200, local: 115 },
  "golden-delicious": { kathmandu: 170, local: 95 },
  fuji: { kathmandu: 240, local: 140 },
  gala: { kathmandu: 220, local: 130 },
  local: { kathmandu: 130, local: 70 },
};
export const GRADE_FACTOR = { A: 1, B: 0.75, C: 0.45 } as const;

export const GRADE_GUIDE: Record<"A" | "B" | "C", { icon: string; text: L }> = {
  A: { icon: "🍎", text: l("ठूलो, दाग नभएको, पूरा रङ", "Large, unmarked, full colour") },
  B: { icon: "🍏", text: l("मझौला, सानो दाग वा कम रङ", "Medium, small marks or less colour") },
  C: { icon: "🥫", text: l("सानो वा दाग भएको — जुस र प्रशोधनका लागि", "Small or marked — for juice and processing") },
};

/** Crop calendar for 2,000–3,000 m (Jumla). PLACEHOLDER pending expert review. */
export const CALENDAR: CalendarTask[] = [
  { month: 1, icon: "🐝", title: l("फूल फुल्दै छ: मौरी जोगाउनुहोस्", "Flowering: protect the bees"), detail: l("फूल फुलेको बेला कीटनाशक नछर्नुहोस्। तुसारोको चेतावनी हेर्नुहोस्।", "Do not spray insecticide in flower. Watch for frost alerts."), articleSlug: "pollinators-bees" },
  { month: 2, icon: "🪤", title: l("फल पातलो पार्ने र कोडलिङ पासो", "Thin fruit and set codling traps"), detail: l("एक गुच्छामा एउटा फल छोड्नुहोस्। फेरोमोन पासो झुण्ड्याउनुहोस्।", "Leave one fruit per cluster. Hang pheromone traps."), articleSlug: "hail-protection" },
  { month: 3, icon: "☀️", title: l("गर्मीको काटछाँट र निकास", "Summer pruning and drainage"), detail: l("पानी-मुना हटाउनुहोस्। वर्षाअघि नाली सफा गर्नुहोस्।", "Remove water sprouts. Clear drains before the monsoon."), articleSlug: "summer-pruning" },
  { month: 4, icon: "🍂", title: l("वर्षायामका रोग हेर्नुहोस्", "Watch for monsoon diseases"), detail: l("पातमा दाग वा पात झरेको देखे फोटो खिचेर जाँच गर्नुहोस्।", "If leaves spot or drop, photograph and check them."), articleSlug: "summer-pruning" },
  { month: 5, icon: "📦", title: l("टिप्ने तयारी", "Get ready for harvest"), detail: l("कार्टुन र क्रेट अर्डर गर्नुहोस्। भारी हाँगामा टेको दिनुहोस्।", "Order cartons and crates. Prop heavy branches."), articleSlug: "hail-protection" },
  { month: 6, icon: "🍎", title: l("टिप्ने, छुट्याउने र बेच्ने", "Harvest, grade and sell"), detail: l("A, B, C छुट्याउनुहोस्। बिक्री ट्याबमा स्याउ सूचीमा राख्नुहोस्।", "Sort into A, B and C. List your apples in the Sell tab."), articleSlug: "jam-jelly" },
  { month: 7, icon: "🧪", title: l("माटो जाँच र झरेका फल", "Soil test and fallen fruit"), detail: l("माटोको नमूना पठाउनुहोस्। झरेका फल जम्मा गरेर नष्ट गर्नुहोस्।", "Send a soil sample. Collect and destroy fallen fruit."), articleSlug: "soil-testing" },
  { month: 8, icon: "⛏️", title: l("पात सफा र नयाँ खाडल", "Clear leaves and dig new pits"), detail: l("झरेका पात गाड्नुहोस्। नयाँ बिरुवाका लागि खाडल खन्नुहोस्।", "Bury fallen leaves. Dig pits for new saplings."), articleSlug: "hd-pit-digging" },
  { month: 9, icon: "✂️", title: l("जाडोको काटछाँट", "Winter pruning"), detail: l("सुकेका र जुधेका हाँगा काट्नुहोस्। कलमीका लागि सायन लिनुहोस्।", "Cut dead and crossing wood. Collect scions for grafting."), articleSlug: "winter-pruning" },
  { month: 10, icon: "🌱", title: l("रोप्ने र कलमी गर्ने", "Plant and graft"), detail: l("नयाँ बिरुवा रोप्नुहोस्। पाकेको मल हाल्नुहोस्।", "Plant new saplings. Add well-rotted manure."), articleSlug: "hd-planting-time" },
  { month: 11, icon: "🛢️", title: l("कोपिला फुल्नुअघिको छर्ने", "Spray before bud break"), detail: l("स्केल र सुलसुलेका लागि विज्ञको सल्लाहमा जाडोको तेल।", "Winter oil for scale and mites, on an expert's advice."), articleSlug: "grafting" },
  { month: 12, icon: "💧", title: l("कोपिला फुल्दा सिँचाइ", "Water at bud break"), detail: l("माटो सुख्खा भए पानी दिनुहोस्। दादका लागि बोर्डो मिश्रण।", "Water if the soil is dry. Bordeaux mixture for scab."), articleSlug: "irrigation" },
];
