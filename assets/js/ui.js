/* Small shared UI helpers used across pages: active-nav highlighting,
   cart badge sync, and a toast for confirming actions. */

function initNav(activePage) {
  document.querySelectorAll("[data-page]").forEach((link) => {
    if (link.dataset.page === activePage) {
      link.setAttribute("aria-current", "page");
    }
  });
  Store.updateCartBadge();
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
