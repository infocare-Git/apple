import type { Article } from "../types";

// PLACEHOLDER content: written to populate the demo. Every article must be
// reviewed and signed off by an apple horticulture expert before field use.
// No doses appear here on purpose; doses come only from approved products.

const a = (x: Omit<Article, "placeholder">): Article => ({ ...x, placeholder: true });

export const ARTICLES: Article[] = [
  // ── Orchard management ──────────────────────────────────────────────
  a({
    slug: "orchard-establishment", topic: "orchard", months: [8, 9, 10], icon: "🏔️",
    title: { ne: "नयाँ बगैंचा कसरी सुरु गर्ने", en: "Starting a new orchard" },
    summary: { ne: "घाम लाग्ने, पानी नजम्ने ठाउँ छान्नुहोस्।", en: "Choose a sunny site where water does not collect." },
    steps: [
      { ne: "दिनभर घाम लाग्ने र चिसो हावा नथुनिने ढलान छान्नुहोस्।", en: "Pick a slope with full-day sun where cold air does not pool." },
      { ne: "जमिनमा पानी जम्छ कि जम्दैन, पानी परेपछि हेर्नुहोस्।", en: "After rain, check that water drains away and does not stand." },
      { ne: "हावाबाट जोगाउन बगैंचाको छेउमा रुखको बार लगाउनुहोस्।", en: "Plant a row of trees on the windy side as a windbreak." },
      { ne: "रोप्नुअघि माटो जाँच गराउनुहोस्।", en: "Get the soil tested before planting." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "varieties-rootstock", topic: "orchard", months: [8, 9, 10], icon: "🍎",
    title: { ne: "जात र मूलवृन्त छनोट", en: "Choosing varieties and rootstock" },
    summary: { ne: "उचाइ र बजार हेरेर जात छान्नुहोस्।", en: "Choose varieties for your altitude and your market." },
    steps: [
      { ne: "आफ्नो उचाइमा राम्रो फल्ने जात कृषि कार्यालयसँग सोध्नुहोस्।", en: "Ask the agriculture office which varieties do well at your altitude." },
      { ne: "परागसेचनका लागि कम्तीमा दुई फरक जात सँगै रोप्नुहोस्।", en: "Plant at least two different varieties together for pollination." },
      { ne: "बाक्लो बगैंचाका लागि होचो मूलवृन्त, सामान्य बगैंचाका लागि बलियो मूलवृन्त छान्नुहोस्।", en: "Use dwarfing rootstock for high-density planting and vigorous rootstock for traditional orchards." },
      { ne: "दर्ता भएको नर्सरीबाट मात्र बिरुवा किन्नुहोस्।", en: "Buy saplings only from a registered nursery." },
    ],
    actions: [{ kind: "order", productId: "sap-fuji" }, { kind: "order", productId: "sap-mm106" }],
  }),
  a({
    slug: "soil-testing", topic: "orchard", months: [7, 8], icon: "🧪",
    title: { ne: "माटो जाँच", en: "Soil testing" },
    summary: { ne: "मल हाल्नुअघि माटोमा के कमी छ थाहा पाउनुहोस्।", en: "Find out what your soil lacks before adding fertiliser." },
    steps: [
      { ne: "बगैंचाका पाँच ठाउँबाट थोरै थोरै माटो खन्नुहोस्।", en: "Dig a little soil from five places across the orchard." },
      { ne: "सबै माटो मिसाएर सफा झोलामा राख्नुहोस्।", en: "Mix it together and put it in a clean bag." },
      { ne: "झोलामा नाम र ठाउँ लेखेर माटो परीक्षण प्रयोगशालामा पठाउनुहोस्।", en: "Label it with your name and place and send it to a soil lab." },
      { ne: "नतिजा आएपछि विज्ञसँग मलको योजना बनाउनुहोस्।", en: "When the result comes, plan fertiliser with an expert." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "irrigation", topic: "orchard", months: [12, 1, 2], icon: "💧",
    title: { ne: "सिँचाइ", en: "Irrigation" },
    summary: { ne: "फूल फुल्दा र फल बढ्दा पानीको कमी हुन नदिनुहोस्।", en: "Do not let trees go short of water at flowering and fruit growth." },
    steps: [
      { ne: "सुख्खा याममा माटो छामेर हेर्नुहोस्; सुकेको भए पानी दिनुहोस्।", en: "In the dry season feel the soil; water when it is dry." },
      { ne: "बोटको फेदमा होइन, छहारीको किनारामा पानी दिनुहोस्।", en: "Water at the edge of the canopy, not against the trunk." },
      { ne: "पानी जोगाउन फेद वरिपरि घाँस वा पातको छापो राख्नुहोस्।", en: "Mulch around the tree with straw or leaves to keep moisture in." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "macro-nutrients", topic: "orchard", months: [10, 11, 3], icon: "🌱",
    title: { ne: "मुख्य खाद्यतत्व (नाइट्रोजन, फस्फोरस, पोटास)", en: "Major nutrients (N, P, K)" },
    summary: { ne: "कति मल हाल्ने भन्ने माटो जाँच र बोटको उमेरमा भर पर्छ।", en: "How much to apply depends on your soil test and the age of the tree." },
    steps: [
      { ne: "हरेक वर्ष कम्पोस्ट वा पाकेको गोबर मल हाल्नुहोस्।", en: "Add compost or well-rotted manure every year." },
      { ne: "रासायनिक मलको मात्रा विज्ञले माटो जाँच हेरेर तोक्नुहुन्छ।", en: "An expert sets the chemical fertiliser dose from your soil test." },
      { ne: "मल छहारीको किनारामा छरेर माटोमा मिलाउनुहोस्।", en: "Spread fertiliser under the canopy edge and mix it into the soil." },
      { ne: "मल हालेपछि पानी दिनुहोस्।", en: "Water after applying fertiliser." },
    ],
    actions: [{ kind: "order", productId: "fert-compost" }, { kind: "ask" }],
  }),
  a({
    slug: "micro-nutrients", topic: "orchard", months: [12, 1], icon: "🍃",
    title: { ne: "सूक्ष्म खाद्यतत्व (बोरोन, जिंक, क्याल्सियम)", en: "Micronutrients (boron, zinc, calcium)" },
    summary: { ne: "पात र फलमा देखिने लक्षणबाट कमी चिन्नुहोस्।", en: "Recognise shortages from signs on leaves and fruit." },
    steps: [
      { ne: "साना, गुच्छा परेका पात जिंकको कमीको सङ्केत हुन सक्छ।", en: "Small, bunched leaves can be a sign of zinc shortage." },
      { ne: "फलभित्र खैरो दाग बोरोन वा क्याल्सियमको कमीले हुन सक्छ।", en: "Brown spots inside the fruit can come from boron or calcium shortage." },
      { ne: "लक्षणको फोटो खिचेर बोट डाक्टरमा जाँच गर्नुहोस्।", en: "Photograph the signs and check them in Tree Doctor." },
      { ne: "छर्ने मात्रा र समय विज्ञले तोकेपछि मात्र प्रयोग गर्नुहोस्।", en: "Spray only after an expert sets the dose and timing." },
    ],
    actions: [{ kind: "diagnose" }, { kind: "order", productId: "fert-boron" }],
  }),
  a({
    slug: "pollinators-bees", topic: "orchard", months: [12, 1], icon: "🐝",
    title: { ne: "मौरी र परागसेचन", en: "Bees and pollination" },
    summary: { ne: "फूल फुल्दा मौरी भए फल धेरै लाग्छ।", en: "Bees at flowering mean more fruit." },
    steps: [
      { ne: "फूल फुल्ने बेला बगैंचामा मौरीका घार राख्नुहोस्।", en: "Keep beehives in the orchard during flowering." },
      { ne: "फूल फुलेको बेला कीटनाशक नछर्नुहोस्।", en: "Never spray insecticide while trees are in flower." },
      { ne: "बगैंचाको छेउमा फूल फुल्ने बोटबिरुवा राख्नुहोस्।", en: "Keep flowering plants around the orchard edge." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "hail-protection", topic: "orchard", months: [1, 2, 3, 4, 5], icon: "🌨️",
    title: { ne: "असिनाबाट जोगाउने", en: "Protecting against hail" },
    summary: { ne: "असिनाको चेतावनी आए फल र बोट जोगाउनुहोस्।", en: "When hail is forecast, protect fruit and trees." },
    steps: [
      { ne: "असिना धेरै पर्ने ठाउँमा असिना जाली लगाउनुहोस्।", en: "In hail-prone places, put up hail nets." },
      { ne: "गृह पृष्ठको मौसम चेतावनी हरेक दिन हेर्नुहोस्।", en: "Check the weather alert on Home every day." },
      { ne: "असिनाले चोट लागेका हाँगा काटेर घाउमा लेप लगाउनुहोस्।", en: "After hail, cut back damaged shoots and seal the wounds." },
      { ne: "बालीबीमा गरेको भए फोटो खिचेर बीमा कम्पनीलाई खबर गर्नुहोस्।", en: "If insured, photograph the damage and tell your insurer." },
    ],
    actions: [{ kind: "ask" }],
  }),

  // ── Training and pruning ────────────────────────────────────────────
  a({
    slug: "training-methods", topic: "pruning", months: [10, 11], icon: "🌳",
    title: { ne: "बोटलाई आकार दिने तरिका", en: "Training methods" },
    summary: { ne: "सानैदेखि आकार दिए बोट बलियो र फल राम्रो हुन्छ।", en: "Shaping young trees gives strong trees and better fruit." },
    steps: [
      { ne: "बीचमा एउटा मुख्य हाँगा (लिडर) राख्नुहोस्।", en: "Keep one central leader." },
      { ne: "चारैतिर फैलिएका तीन–चार बलिया हाँगा छान्नुहोस्।", en: "Choose three or four strong branches spread around the trunk." },
      { ne: "एकै ठाउँबाट निस्केका हाँगा हटाउनुहोस्।", en: "Remove branches that start from the same point." },
    ],
    actions: [{ kind: "order", productId: "tool-secateurs" }],
  }),
  a({
    slug: "winter-pruning", topic: "pruning", months: [9, 10], icon: "✂️",
    title: { ne: "जाडोको काटछाँट", en: "Winter pruning" },
    summary: { ne: "पात झरेपछि र कोपिला लाग्नुअघि काटछाँट गर्नुहोस्।", en: "Prune after leaf fall and before buds swell." },
    steps: [
      { ne: "सुकेका, रोगी र भाँचिएका हाँगा पहिले काट्नुहोस्।", en: "First cut out dead, diseased and broken wood." },
      { ne: "भित्रतिर फर्केका र एकअर्कामा जुधेका हाँगा हटाउनुहोस्।", en: "Remove branches that grow inward or cross each other." },
      { ne: "घाम र हावा छिर्ने गरी बोटको बीच खुला राख्नुहोस्।", en: "Open the centre so sun and air can get in." },
      { ne: "ठूलो घाउमा लेप लगाउनुहोस्।", en: "Seal large cuts with wound paste." },
    ],
    actions: [{ kind: "order", productId: "tool-saw" }, { kind: "order", productId: "tool-secateurs" }],
  }),
  a({
    slug: "summer-pruning", topic: "pruning", months: [3, 4], icon: "☀️",
    title: { ne: "गर्मीको काटछाँट", en: "Summer pruning" },
    summary: { ne: "धेरै बढेका सोझा मुना हटाएर फलमा घाम पुर्‍याउनुहोस्।", en: "Remove strong upright shoots so fruit gets sun." },
    steps: [
      { ne: "ठाडो बढेका पानी-मुना (वाटर स्प्राउट) हटाउनुहोस्।", en: "Remove upright water sprouts." },
      { ne: "फललाई छेक्ने पात भएका मुना छोट्याउनुहोस्।", en: "Shorten shoots whose leaves shade the fruit." },
      { ne: "गर्मीमा धेरै नकाट्नुहोस्; थोरै मात्र हटाउनुहोस्।", en: "Do not cut hard in summer; remove only a little." },
    ],
    actions: [{ kind: "order", productId: "tool-secateurs" }],
  }),
  a({
    slug: "pruning-aftercare", topic: "pruning", months: [10, 11], icon: "🩹",
    title: { ne: "काटछाँटपछिको हेरचाह", en: "After-care following pruning" },
    summary: { ne: "घाउ जोगाउनुहोस् र काटेका हाँगा बगैंचाबाट हटाउनुहोस्।", en: "Protect the cuts and clear prunings from the orchard." },
    steps: [
      { ne: "काटेका रोगी हाँगा बगैंचाबाट टाढा लगेर नष्ट गर्नुहोस्।", en: "Take diseased prunings away from the orchard and destroy them." },
      { ne: "ठूला घाउमा बोर्डो पेस्ट वा लेप लगाउनुहोस्।", en: "Cover large cuts with Bordeaux paste or wound sealant." },
      { ne: "हरेक बोट काटेपछि कैंची सफा गर्नुहोस्।", en: "Clean your secateurs after each tree." },
    ],
    actions: [{ kind: "order", productId: "prot-bordeaux" }],
  }),
  a({
    slug: "tool-hygiene", topic: "pruning", months: [9, 10, 11], icon: "🧼",
    title: { ne: "औजारको सफाइ र धार", en: "Keeping tools clean and sharp" },
    summary: { ne: "सफा र धारिलो औजारले रोग सर्दैन र घाउ छिटो निको हुन्छ।", en: "Clean, sharp tools do not spread disease and make cuts heal faster." },
    steps: [
      { ne: "काम सुरु गर्नुअघि कैंची र आरी धार लगाउनुहोस्।", en: "Sharpen secateurs and saw before you start." },
      { ne: "रोगी बोट काटेपछि औजार सफा गरेर मात्र अर्को बोटमा जानुहोस्।", en: "After a diseased tree, clean the tools before moving on." },
      { ne: "काम सकिएपछि औजार सुकाएर तेल लगाउनुहोस्।", en: "When you finish, dry the tools and oil them." },
    ],
    actions: [{ kind: "order", productId: "tool-loppers" }],
  }),
  a({
    slug: "young-tree-training", topic: "pruning", months: [10, 11], icon: "🌿",
    title: { ne: "नयाँ बोटको पहिलो तीन वर्ष", en: "The first three years of a young tree" },
    summary: { ne: "पहिलो वर्षमा फल होइन, बलियो ढाँचा बनाउनुहोस्।", en: "In the early years build a strong frame, not fruit." },
    steps: [
      { ne: "रोपेपछि मुख्य हाँगा घुँडाको उचाइमा छोट्याउनुहोस्।", en: "After planting, head the leader back to about knee height." },
      { ne: "पहिलो दुई वर्ष लागेका फूल र फल हटाउनुहोस्।", en: "Remove flowers and fruit for the first two years." },
      { ne: "हरेक जाडोमा छानेका हाँगा मात्र राख्नुहोस्।", en: "Each winter keep only the branches you chose." },
    ],
    actions: [{ kind: "ask" }],
  }),

  // ── High-density orchards ───────────────────────────────────────────
  a({
    slug: "hd-spacing-layout", topic: "highdensity", months: [8, 9], icon: "📐",
    title: { ne: "बाक्लो बगैंचाको दूरी र नक्सा", en: "High-density spacing and layout" },
    summary: { ne: "होचो मूलवृन्तमा बोट नजिक नजिक रोपिन्छ।", en: "On dwarfing rootstock, trees are planted close together." },
    steps: [
      { ne: "लाइन उत्तर–दक्षिण बनाउनुहोस् ताकि दुवैतिर घाम लागोस्।", en: "Run rows north–south so both sides get sun." },
      { ne: "बोटबीच र लाइनबीचको दूरी मूलवृन्त हेरेर विज्ञसँग तय गर्नुहोस्।", en: "Agree tree and row spacing for your rootstock with an expert." },
      { ne: "डोरी र किला लगाएर खाडलको ठाउँ चिन्ह लगाउनुहोस्।", en: "Mark pit positions with a rope and pegs." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "hd-pit-digging", topic: "highdensity", months: [8, 9], icon: "⛏️",
    title: { ne: "खाडल खन्ने र भर्ने", en: "Digging and filling pits" },
    summary: { ne: "रोप्नुभन्दा एक महिना अघि खाडल तयार गर्नुहोस्।", en: "Prepare pits a month before planting." },
    steps: [
      { ne: "माथिको माटो र तलको माटो छुट्टाछुट्टै राख्नुहोस्।", en: "Keep topsoil and subsoil in separate heaps." },
      { ne: "माथिको माटोमा पाकेको मल मिसाएर खाडल भर्नुहोस्।", en: "Fill the pit with topsoil mixed with well-rotted manure." },
      { ne: "खाडल भरेपछि पानी दिएर माटो बस्न दिनुहोस्।", en: "Water the filled pit and let the soil settle." },
    ],
    actions: [{ kind: "order", productId: "fert-compost" }],
  }),
  a({
    slug: "hd-planting-time", topic: "highdensity", months: [10, 11], icon: "🗓️",
    title: { ne: "रोप्ने समय र तरिका", en: "When and how to plant" },
    summary: { ne: "बिरुवा सुतेको बेला, माघ–फागुनमा रोप्नुहोस्।", en: "Plant while saplings are dormant, in Magh–Falgun." },
    steps: [
      { ne: "कलमी गरेको जोर्नी माटोभन्दा माथि रहने गरी रोप्नुहोस्।", en: "Plant so the graft union stays above the soil." },
      { ne: "जरा नमोडी फैलाएर माटो थिच्नुहोस्।", en: "Spread the roots without bending them and firm the soil." },
      { ne: "रोपेपछि तुरुन्त पानी दिनुहोस्।", en: "Water immediately after planting." },
    ],
    actions: [{ kind: "order", productId: "sap-gala" }],
  }),
  a({
    slug: "hd-trellis", topic: "highdensity", months: [9, 10, 11], icon: "🪜",
    title: { ne: "ट्रेलिस (तार र खम्बा)", en: "Trellis (wires and posts)" },
    summary: { ne: "होचो मूलवृन्तका बोटलाई सहारा चाहिन्छ।", en: "Trees on dwarfing rootstock need support." },
    steps: [
      { ne: "लाइनको दुवै छेउमा बलियो खम्बा गाड्नुहोस्।", en: "Set strong anchor posts at both ends of each row." },
      { ne: "बीचमा निश्चित दूरीमा खम्बा राखेर तार तान्नुहोस्।", en: "Add posts along the row and stretch the wires." },
      { ne: "मुख्य हाँगालाई नरम डोरीले तारमा बाँध्नुहोस्।", en: "Tie the leader to the wire with soft tape." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "hd-notching-nicking", topic: "highdensity", months: [12, 1], icon: "🔪",
    title: { ne: "नचिङ र निकिङ", en: "Notching and nicking" },
    summary: { ne: "कोपिलामाथि वा मुनि सानो काट गरेर हाँगा निकाल्ने वा रोक्ने।", en: "A small cut above or below a bud to push or stop a branch." },
    steps: [
      { ne: "हाँगा चाहिने ठाउँको कोपिलामाथि सानो काट (नचिङ) गर्नुहोस्।", en: "Cut a small notch above a bud where you want a branch." },
      { ne: "बढी बढ्न नदिन कोपिलामुनि काट (निकिङ) गर्नुहोस्।", en: "Nick below a bud to slow its growth." },
      { ne: "कोपिला फुल्न लागेको बेला मात्र गर्नुहोस्।", en: "Do it only when buds are just starting to swell." },
    ],
    actions: [{ kind: "order", productId: "tool-grafting-knife" }],
  }),
  a({
    slug: "hd-top-working", topic: "highdensity", months: [10, 11], icon: "🔁",
    title: { ne: "टप वर्किङ (पुरानो बोटमा नयाँ जात)", en: "Top working (new variety on an old tree)" },
    summary: { ne: "पुरानो बोटको हाँगामा नयाँ जातको कलमी गर्ने।", en: "Graft a new variety onto the branches of an old tree." },
    steps: [
      { ne: "बलियो, स्वस्थ पुरानो बोट छान्नुहोस्।", en: "Choose a strong, healthy old tree." },
      { ne: "मुख्य हाँगाहरू काटेर त्यसमा नयाँ जातको सायन कलमी गर्नुहोस्।", en: "Cut back the main branches and graft scions of the new variety." },
      { ne: "कलमी गरेको ठाउँ टेप र मैनले ढाक्नुहोस्।", en: "Cover the grafts with tape and wax." },
    ],
    actions: [{ kind: "order", productId: "tool-grafting-tape" }],
  }),
  a({
    slug: "hd-leader-bending", topic: "highdensity", months: [2, 3, 4], icon: "↪️",
    title: { ne: "लिडर झुकाउने र हाँगा फैलाउने", en: "Leader bending and feather spreading" },
    summary: { ne: "हाँगालाई तेर्सो बनाउँदा फल छिटो लाग्छ।", en: "Flatter branches come into fruit sooner." },
    steps: [
      { ne: "नयाँ हाँगालाई काठको सानो किलाले तेर्सोतिर फैलाउनुहोस्।", en: "Spread young side shoots towards horizontal with small wooden spacers." },
      { ne: "बढी बढेको लिडरलाई बिस्तारै झुकाएर तारमा बाँध्नुहोस्।", en: "Bend an over-vigorous leader gently and tie it to the wire." },
      { ne: "हाँगा नभाँचियोस् भनेर बिस्तारै, थोरै थोरै गर्नुहोस्।", en: "Work slowly, a little at a time, so branches do not snap." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "hd-leader-bagging-dutch", topic: "highdensity", months: [10, 11, 3], icon: "🛍️",
    title: { ne: "लिडर ब्यागिङ र डच कटिङ", en: "Leader bagging and Dutch cutting" },
    summary: { ne: "मुनामा झोला लगाएर र ठूला हाँगा फेदैबाट काटेर बोट सन्तुलित राख्ने।", en: "Bag the leader tip and remove big branches at the base to keep trees balanced." },
    steps: [
      { ne: "लिडरको टुप्पोमा सानो झोला लगाउँदा माथिका हाँगा राम्ररी निस्कन्छन्।", en: "A small bag over the leader tip helps upper side shoots form." },
      { ne: "डच कटिङमा धेरै मोटो हाँगा फेदमा तेर्सो ठुटो छोडेर काटिन्छ।", en: "In a Dutch cut, a too-thick branch is removed leaving a short angled stub." },
      { ne: "ठुटोबाट निस्केको नयाँ पातलो हाँगालाई फल्ने हाँगा बनाउनुहोस्।", en: "Keep the new thin shoot from the stub as the next fruiting branch." },
    ],
    actions: [{ kind: "ask" }],
  }),

  // ── Propagation ─────────────────────────────────────────────────────
  a({
    slug: "grafting", topic: "propagation", months: [10, 11], icon: "🩹",
    title: { ne: "कलमी गर्ने", en: "Grafting" },
    summary: { ne: "मूलवृन्तमा मनपर्ने जातको सायन जोड्ने।", en: "Join a scion of the variety you want onto a rootstock." },
    steps: [
      { ne: "मूलवृन्त र सायन उस्तै मोटाइका छान्नुहोस्।", en: "Choose rootstock and scion of the same thickness." },
      { ne: "दुवैमा मिल्ने गरी धारिलो चक्कुले काट्नुहोस्।", en: "Make matching cuts on both with a sharp knife." },
      { ne: "हरियो भाग मिलाएर जोड्नुहोस् र टेपले कसेर बाँध्नुहोस्।", en: "Line up the green layers, join them and wrap tightly with tape." },
      { ne: "मूलवृन्तबाट निस्कने मुना हटाइराख्नुहोस्।", en: "Keep removing shoots that grow from the rootstock." },
    ],
    actions: [{ kind: "order", productId: "tool-grafting-knife" }, { kind: "order", productId: "tool-grafting-tape" }],
  }),
  a({
    slug: "rootstock-propagation", topic: "propagation", months: [11, 12], icon: "🌾",
    title: { ne: "मूलवृन्त उत्पादन", en: "Producing rootstock" },
    summary: { ne: "स्टुल लेयरिङबाट एउटै आमाबोटबाट धेरै मूलवृन्त।", en: "Stool layering gives many rootstocks from one mother plant." },
    steps: [
      { ne: "आमाबोटलाई जमिननजिक काटेर नयाँ मुना आउन दिनुहोस्।", en: "Cut the mother plant near the ground and let new shoots grow." },
      { ne: "मुना बढ्दै जाँदा फेदमा माटो थुपार्दै जानुहोस्।", en: "Heap soil around the base as the shoots grow." },
      { ne: "जाडोमा जरा लागेका मुना छुट्याएर रोप्नुहोस्।", en: "In winter, separate rooted shoots and plant them out." },
    ],
    actions: [{ kind: "order", productId: "sap-m9" }],
  }),
  a({
    slug: "tissue-culture", topic: "propagation", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], icon: "🧫",
    title: { ne: "टिस्यु कल्चर बिरुवा", en: "Tissue-culture plants" },
    summary: { ne: "प्रयोगशालामा बनेका रोगमुक्त बिरुवा।", en: "Disease-free plants grown in a laboratory." },
    steps: [
      { ne: "प्रमाणित प्रयोगशाला वा नर्सरीबाट मात्र किन्नुहोस्।", en: "Buy only from a certified lab or nursery." },
      { ne: "ल्याएपछि केही दिन छहारीमा राखेर बानी पार्नुहोस्।", en: "Harden them in shade for a few days after arrival." },
      { ne: "बानी परेपछि मात्र खेतमा सार्नुहोस्।", en: "Move them to the field only once hardened." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "scion-collection", topic: "propagation", months: [9, 10], icon: "🪵",
    title: { ne: "सायन सङ्कलन र मैन लगाउने", en: "Collecting and waxing scions" },
    summary: { ne: "स्वस्थ बोटबाट जाडोमा सायन लिनुहोस्।", en: "Take scions from healthy trees in winter." },
    steps: [
      { ne: "रोग नलागेको, राम्रो फल्ने बोटबाट एक वर्षे हाँगा लिनुहोस्।", en: "Take one-year-old shoots from a healthy, productive tree." },
      { ne: "काटेको टुप्पोमा मैन लगाएर सुक्न नदिनुहोस्।", en: "Wax the cut ends so they do not dry out." },
      { ne: "भिजेको कपडा वा भुसमा बेरेर चिसो ठाउँमा राख्नुहोस्।", en: "Wrap in damp cloth or sawdust and keep cool." },
    ],
    actions: [{ kind: "order", productId: "tool-grafting-wax" }],
  }),

  // ── Processing ──────────────────────────────────────────────────────
  a({
    slug: "jam-jelly", topic: "processing", months: [6, 7, 8], icon: "🫙",
    title: { ne: "जाम र जेली", en: "Jam and jelly" },
    summary: { ne: "सानो वा दाग लागेको स्याउबाट पनि आम्दानी।", en: "Earn from small or marked apples too." },
    steps: [
      { ne: "स्याउ धोएर कुहिएको भाग हटाउनुहोस्।", en: "Wash the apples and cut away any rotten parts." },
      { ne: "काटेर पकाउनुहोस् र नुस्खा अनुसार चिनी मिसाउनुहोस्।", en: "Chop, cook and add sugar following an approved recipe." },
      { ne: "उमालेर सफा गरेका सिसीमा तातै भर्नुहोस्।", en: "Fill hot into sterilised jars." },
      { ne: "सिसीमा मिति र नाम लेख्नुहोस्।", en: "Label each jar with the date and name." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "dried-slices", topic: "processing", months: [6, 7, 8], icon: "🍏",
    title: { ne: "सुकेको स्याउ (चाना)", en: "Dried apple slices" },
    summary: { ne: "घाम वा ड्रायरमा सुकाएर लामो समय राख्न सकिन्छ।", en: "Dried in sun or a dryer, they keep for a long time." },
    steps: [
      { ne: "स्याउलाई पातलो, उस्तै मोटाइमा काट्नुहोस्।", en: "Slice apples thinly and evenly." },
      { ne: "धूलो नपर्ने गरी जालीमा फिँजाएर सुकाउनुहोस्।", en: "Spread on a mesh, covered from dust, to dry." },
      { ne: "राम्ररी सुकेपछि बन्द झोलामा राख्नुहोस्।", en: "When fully dry, store in sealed bags." },
    ],
    actions: [{ kind: "order", productId: "pack-labels" }],
  }),
  a({
    slug: "juice-cider", topic: "processing", months: [6, 7, 8], icon: "🧃",
    title: { ne: "जुस र साइडर", en: "Juice and cider" },
    summary: { ne: "सफाइ नै सबैभन्दा महत्त्वपूर्ण।", en: "Cleanliness matters most." },
    steps: [
      { ne: "पाकेका, सफा स्याउ मात्र प्रयोग गर्नुहोस्।", en: "Use only ripe, clean apples." },
      { ne: "भाँडाकुँडा र मेसिन उमालेको पानीले सफा गर्नुहोस्।", en: "Clean all equipment with boiled water." },
      { ne: "बेच्नुअघि खाद्य प्रविधि कार्यालयबाट अनुमति लिनुहोस्।", en: "Get approval from the food technology office before selling." },
    ],
    actions: [{ kind: "ask" }],
  }),
  a({
    slug: "apple-powder", topic: "processing", months: [7, 8], icon: "🥣",
    title: { ne: "स्याउको धुलो", en: "Apple powder" },
    summary: { ne: "सुकेको स्याउ पिसेर धुलो बनाउन सकिन्छ।", en: "Dried apple can be ground into powder." },
    steps: [
      { ne: "पूरै कुरकुरे हुने गरी स्याउ सुकाउनुहोस्।", en: "Dry the slices until fully crisp." },
      { ne: "सफा मिलमा पिसेर चाल्नुहोस्।", en: "Grind in a clean mill and sieve." },
      { ne: "ओसिलो नपर्ने गरी बन्द भाँडामा राख्नुहोस्।", en: "Store airtight, away from damp." },
    ],
    actions: [{ kind: "ask" }],
  }),
];

export const TOPICS = ["orchard", "pruning", "highdensity", "propagation", "processing"] as const;
