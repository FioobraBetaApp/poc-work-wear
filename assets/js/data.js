/* Seed data for the demo. Everything is re-hydrated into localStorage on
   first load (see store.js) so the app feels interactive without a backend.

   Roles in this demo:
   - "buyer"  = Modum kommune. Logs in, browses the catalogue Re:textile has
                listed and orders workwear (mostly buying back its own garments).
   - "admin"  = Re:textile. Receives garments from the municipalities, checks /
                repairs / sorts them, lists them for sale and handles orders.

   Municipalities never sell to each other directly — Re:textile is always the
   seller. A listing's `origin` is just the municipality the garment came from. */

const MY_MUNICIPALITY = "Modum kommune";
const SELLER = "Re:textile";

const MUNICIPALITIES = [
  "Modum kommune",
  "Drammen kommune",
  "Kongsberg kommune",
  "Lier kommune",
  "Øvre Eiker kommune",
  "Ringerike kommune",
];

const CATEGORIES = ["Vernebekledning", "Overdeler", "Underdeler"];

const CATEGORY_COLORS = {
  Vernebekledning: { fg: "#7a2e00", bg: "#ffe8cc" },
  Overdeler: { fg: "#0b3d78", bg: "#d6e8ff" },
  Underdeler: { fg: "#1a4d2e", bg: "#d8f0dc" },
};

/* Processing pipeline a garment moves through at Re:textile before it is
   listed for sale, and the lifecycle of an order from a municipality. */
const INTAKE_FLOW = ["Til kontroll", "Til reparasjon", "Til sortering", "Klar for salg"];
const ORDER_FLOW = ["Venter", "Bekreftet", "Sendt", "Levert"];

const SUGGESTED_PRICE = {
  Vernebekledning: 350,
  Overdeler: 250,
  Underdeler: 260,
};

/**
 * Builds a small self-contained SVG "photo" for a listing so the demo
 * needs no image assets or network access. Purely decorative — real
 * alt text is generated separately from the listing title/category.
 */
function placeholderImage(category) {
  const c = CATEGORY_COLORS[category] || { fg: "#333", bg: "#eee" };
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img">
      <rect width="320" height="200" fill="${c.bg}"/>
      <g fill="${c.fg}" fill-opacity="0.85">
        <path d="M130 40 L130 30 Q160 10 190 30 L190 40 L215 55 L205 90 L190 82 L190 170
                 Q160 180 130 170 L130 82 L115 90 L105 55 Z" />
      </g>
      <text x="160" y="192" text-anchor="middle" font-family="Arial, sans-serif"
            font-size="12" fill="${c.fg}">${category}</text>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg.replace(/\s+/g, " "));
}

/* Garments Re:textile has checked and listed for sale. `origin` is the
   municipality the garment came from — shown for context only, it never
   restricts who can order. Many are from Modum: the first use case is
   Modum buying its own workwear back. */
const SEED_LISTINGS = [
  { id: 1, title: "Vernebukse kl.1", category: "Vernebekledning", price: 350, size: "L", quantity: 8, origin: "Modum kommune", condition: "Reparert", description: "Klasse 1. Byttet glidelås og forsterket knær." },
  { id: 2, title: "Hi-vis vernejakke", category: "Vernebekledning", price: 420, size: "XL", quantity: 5, origin: "Drammen kommune", condition: "Kontrollert", description: "Vanntett, klasse 3, refleks intakt." },
  { id: 3, title: "Regntøysett", category: "Vernebekledning", price: 280, size: "M", quantity: 12, origin: "Modum kommune", condition: "Kontrollert", description: "Komplett sett, jakke og bukse." },
  { id: 4, title: "Kuldedress vinter", category: "Vernebekledning", price: 650, size: "XXL", quantity: 3, origin: "Lier kommune", condition: "Som ny", description: "Varm kuldedress, minimal bruk." },
  { id: 5, title: "Refleksvest klasse 2", category: "Vernebekledning", price: 150, size: "One size", quantity: 20, origin: "Modum kommune", condition: "Kontrollert", description: "Rengjort, god synlighet." },
  { id: 6, title: "Arbeids-t-skjorte (5-pk)", category: "Overdeler", price: 120, size: "M", quantity: 15, origin: "Øvre Eiker kommune", condition: "Kontrollert", description: "Pustende, vasket og sortert." },
  { id: 7, title: "Softshell genser", category: "Overdeler", price: 390, size: "L", quantity: 6, origin: "Modum kommune", condition: "Reparert", description: "Vind- og vannavvisende, ny borrelås." },
  { id: 8, title: "Flanellskjorte", category: "Overdeler", price: 200, size: "S", quantity: 9, origin: "Ringerike kommune", condition: "Kontrollert", description: "Varm, god kvalitet." },
  { id: 9, title: "Fleecejakke", category: "Overdeler", price: 310, size: "XL", quantity: 7, origin: "Drammen kommune", condition: "Kontrollert", description: "Lett, for mellomsesong." },
  { id: 10, title: "Vindjakke", category: "Overdeler", price: 340, size: "M", quantity: 10, origin: "Modum kommune", condition: "Kontrollert", description: "Lett og pustende." },
  { id: 11, title: "Arbeidsbukse", category: "Underdeler", price: 280, size: "L", quantity: 11, origin: "Modum kommune", condition: "Reparert", description: "Mange lommer, forsterkede sømmer." },
  { id: 12, title: "Termobukse", category: "Underdeler", price: 250, size: "XL", quantity: 6, origin: "Lier kommune", condition: "Kontrollert", description: "Varm, for kalde dager." },
  { id: 13, title: "Arbeidsshorts", category: "Underdeler", price: 180, size: "M", quantity: 14, origin: "Øvre Eiker kommune", condition: "Kontrollert", description: "For sommersesong." },
  { id: 14, title: "Regnbukse", category: "Underdeler", price: 220, size: "S", quantity: 9, origin: "Ringerike kommune", condition: "Kontrollert", description: "Vanntett, justerbar linning." },
  { id: 15, title: "Arbeidsbukse vinter", category: "Underdeler", price: 400, size: "XXL", quantity: 4, origin: "Modum kommune", condition: "Som ny", description: "Fôret, for vinterbruk." },
  { id: 16, title: "Vernebukse hi-vis", category: "Vernebekledning", price: 380, size: "L", quantity: 0, origin: "Modum kommune", condition: "Reparert", description: "Klasse 1 med refleks. Utsolgt for øyeblikket." },
];

/* Garments received from municipalities that Re:textile is still processing. */
const SEED_INTAKE = [
  { id: 101, title: "Vernejakke hi-vis", category: "Vernebekledning", size: "XL", quantity: 6, origin: "Modum kommune", received: "2026-09-01", status: "Til kontroll" },
  { id: 102, title: "Arbeidsbukse", category: "Underdeler", size: "L", quantity: 12, origin: "Modum kommune", received: "2026-08-29", status: "Til reparasjon" },
  { id: 103, title: "Softshell genser", category: "Overdeler", size: "M", quantity: 4, origin: "Drammen kommune", received: "2026-08-28", status: "Til sortering" },
  { id: 104, title: "Regntøysett", category: "Vernebekledning", size: "M", quantity: 9, origin: "Modum kommune", received: "2026-08-25", status: "Klar for salg" },
  { id: 105, title: "Fleecejakke", category: "Overdeler", size: "L", quantity: 7, origin: "Kongsberg kommune", received: "2026-08-22", status: "Til kontroll" },
];

/* Orders always go from a municipality to Re:textile. The buyer view shows
   only Modum's orders; the admin view shows every municipality's. */
const SEED_ORDERS = [
  { id: "B-1042", date: "2026-08-18", buyer: "Modum kommune", items: [{ title: "Hi-vis vernejakke", quantity: 2, price: 420 }], status: "Levert" },
  { id: "B-1058", date: "2026-08-27", buyer: "Modum kommune", items: [{ title: "Termobukse", quantity: 3, price: 250 }], status: "Sendt" },
  { id: "B-1063", date: "2026-09-01", buyer: "Modum kommune", items: [{ title: "Flanellskjorte", quantity: 4, price: 200 }, { title: "Arbeidsshorts", quantity: 6, price: 180 }], status: "Bekreftet" },
  { id: "B-1071", date: "2026-09-03", buyer: "Drammen kommune", items: [{ title: "Softshell genser", quantity: 2, price: 390 }], status: "Venter" },
];
