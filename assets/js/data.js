/* Seed data for the demo. Everything is re-hydrated into localStorage on
   first load (see store.js) so the app feels interactive without a backend. */

const MY_MUNICIPALITY = "Modum kommune";

const CATEGORIES = ["Vernebekledning", "Overdeler", "Underdeler"];

const CATEGORY_COLORS = {
  Vernebekledning: { fg: "#7a2e00", bg: "#ffe8cc" },
  Overdeler: { fg: "#0b3d78", bg: "#d6e8ff" },
  Underdeler: { fg: "#1a4d2e", bg: "#d8f0dc" },
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

const SEED_LISTINGS = [
  { id: 1, title: "Vernebukse kl.1", category: "Vernebekledning", price: 350, size: "L", quantity: 8, municipality: "Drammen kommune", description: "Slitesterk vernebukse klasse 1, lite brukt." },
  { id: 2, title: "Hi-vis vernejakke", category: "Vernebekledning", price: 420, size: "XL", quantity: 5, municipality: "Kongsberg kommune", description: "Vanntett vernejakke med refleks, klasse 3." },
  { id: 3, title: "Regntøy sett", category: "Vernebekledning", price: 280, size: "M", quantity: 12, municipality: MY_MUNICIPALITY, description: "Komplett regntøysett, jakke og bukse." },
  { id: 4, title: "Kuldedress vinter", category: "Vernebekledning", price: 650, size: "XXL", quantity: 3, municipality: "Lier kommune", description: "Varm kuldedress for utearbeid vinterstid." },
  { id: 5, title: "Vernevest refleks", category: "Vernebekledning", price: 150, size: "One size", quantity: 20, municipality: MY_MUNICIPALITY, description: "Refleksvest klasse 2, ubrukt lager." },
  { id: 6, title: "T-skjorte arbeid", category: "Overdeler", price: 120, size: "M", quantity: 15, municipality: "Øvre Eiker kommune", description: "Pustende arbeids-t-skjorte, pakke med 5 stk." },
  { id: 7, title: "Softshell genser", category: "Overdeler", price: 390, size: "L", quantity: 6, municipality: MY_MUNICIPALITY, description: "Vind- og vannavvisende softshell genser." },
  { id: 8, title: "Flanellskjorte", category: "Overdeler", price: 200, size: "S", quantity: 9, municipality: "Ringerike kommune", description: "Varm flanellskjorte, god kvalitet." },
  { id: 9, title: "Fleecejakke", category: "Overdeler", price: 310, size: "XL", quantity: 7, municipality: "Drammen kommune", description: "Lett fleecejakke for mellomsesong." },
  { id: 10, title: "Vindjakke", category: "Overdeler", price: 340, size: "M", quantity: 10, municipality: "Kongsberg kommune", description: "Lett og pustende vindjakke." },
  { id: 11, title: "Arbeidsbukse", category: "Underdeler", price: 280, size: "L", quantity: 11, municipality: MY_MUNICIPALITY, description: "Slitesterk arbeidsbukse med mange lommer." },
  { id: 12, title: "Termobukse", category: "Underdeler", price: 250, size: "XL", quantity: 6, municipality: "Lier kommune", description: "Varm termobukse for kalde dager." },
  { id: 13, title: "Shorts arbeid", category: "Underdeler", price: 180, size: "M", quantity: 14, municipality: "Øvre Eiker kommune", description: "Arbeidsshorts for sommersesongen." },
  { id: 14, title: "Regnbukse", category: "Underdeler", price: 220, size: "S", quantity: 9, municipality: "Ringerike kommune", description: "Vanntett regnbukse, justerbar linning." },
  { id: 15, title: "Arbeidsbukse vinter", category: "Underdeler", price: 400, size: "XXL", quantity: 4, municipality: MY_MUNICIPALITY, description: "Fôret arbeidsbukse for vinterbruk." },
  { id: 16, title: "Vernebukse hi-vis", category: "Vernebekledning", price: 380, size: "L", quantity: 5, municipality: "Drammen kommune", description: "Vernebukse klasse 1 med refleksstriper." },
];

const SEED_ORDERS = [
  { id: "B-1042", date: "2026-08-18", direction: "sent", counterparty: "Kongsberg kommune", items: [{ title: "Hi-vis vernejakke", quantity: 2, price: 420 }], status: "Levert" },
  { id: "B-1058", date: "2026-08-27", direction: "sent", counterparty: "Lier kommune", items: [{ title: "Termobukse", quantity: 3, price: 250 }], status: "Sendt" },
  { id: "B-1063", date: "2026-09-01", direction: "sent", counterparty: "Ringerike kommune", items: [{ title: "Flanellskjorte", quantity: 4, price: 200 }], status: "Bekreftet" },
  { id: "M-2031", date: "2026-08-20", direction: "received", counterparty: "Øvre Eiker kommune", items: [{ title: "Softshell genser", quantity: 2, price: 390 }], status: "Levert" },
  { id: "M-2044", date: "2026-08-30", direction: "received", counterparty: "Drammen kommune", items: [{ title: "Regntøy sett", quantity: 5, price: 280 }], status: "Venter" },
];
