/* Small shared UI helpers used across pages: the role-aware header,
   active-nav highlighting, cart badge sync, and a toast for confirming
   actions. */

const BUYER_NAV = [
  ["butikk.html", "butikk", "Butikk"],
  [
    "handlekurv.html",
    "handlekurv",
    'Handlekurv<span class="badge-count" data-cart-count aria-hidden="true">0</span><span class="sr-only"> varer i handlekurv</span>',
  ],
  ["bestillinger.html", "bestillinger", "Bestillinger"],
];

const ADMIN_NAV = [
  ["admin.html", "oversikt", "Oversikt"],
  ["admin-varemottak.html", "varemottak", "Varemottak"],
  ["admin-lager.html", "lager", "Varer på lager"],
  ["admin-bestillinger.html", "bestillinger", "Bestillinger"],
];

/** Renders the header into <div id="app-header"> and wires the mobile
 *  menu toggle. `active` matches the data-page key of the current page. */
function renderHeader(role, active) {
  const host = document.getElementById("app-header");
  if (!host) return;

  const isAdmin = role === "admin";
  const who = isAdmin ? Store.SELLER : Store.MY_MUNICIPALITY;
  const roleLabel = isAdmin ? "Admin" : "Kjøper";
  const tagline = isAdmin
    ? "Administrasjon – kontroll, lager og bestillinger"
    : "Kjøp av kontrollert og reparert arbeidstøy";
  const home = isAdmin ? "admin.html" : "butikk.html";
  const links = isAdmin ? ADMIN_NAV : BUYER_NAV;

  const linkHtml = links
    .map(
      ([href, key, label]) =>
        `<a href="${href}" data-page="${key}"${
          key === active ? ' aria-current="page"' : ""
        }>${label}</a>`
    )
    .join("");

  host.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${home}">
          <span class="brand-name">Arbeidstøybørsen</span>
          <span class="brand-tagline">${tagline}</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
          <span class="nav-toggle-bars" aria-hidden="true"></span>
          <span>Meny</span>
        </button>
        <nav class="main-nav" id="main-nav" aria-label="Hovedmeny">
          <p class="nav-context">Innlogget som <strong>${who}</strong> · ${roleLabel}</p>
          ${linkHtml}
          <a href="index.html" data-page="bytt" class="nav-switch">Bytt perspektiv</a>
        </nav>
        <span class="user-chip">${who} · <strong>${roleLabel}</strong></span>
      </div>
    </header>`;

  const toggle = host.querySelector(".nav-toggle");
  const nav = host.querySelector(".main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  Store.updateCartBadge();
}

/** Guards a page to a single role. If no role is set yet (e.g. someone
 *  opened a deep link), adopt the page's role; if a different role is
 *  active, bounce back to the perspective chooser. Returns true when the
 *  page is allowed to render. */
function initPage(role, active) {
  const current = Store.getRole();
  if (!current) {
    Store.setRole(role);
  } else if (current !== role) {
    window.location.replace("index.html");
    return false;
  }
  renderHeader(role, active);
  return true;
}

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
