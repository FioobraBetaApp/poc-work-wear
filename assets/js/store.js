/* Tiny localStorage-backed "store". No backend — state just needs to
   feel persistent while clicking around the demo. */

const Store = (() => {
  const KEY_LISTINGS = "wwm2_listings";
  const KEY_CART = "wwm2_cart";
  const KEY_ORDERS = "wwm2_orders";
  const KEY_INTAKE = "wwm2_intake";
  const KEY_ROLE = "wwm2_role";

  function init() {
    if (!localStorage.getItem(KEY_LISTINGS)) {
      localStorage.setItem(KEY_LISTINGS, JSON.stringify(SEED_LISTINGS));
    }
    if (!localStorage.getItem(KEY_ORDERS)) {
      localStorage.setItem(KEY_ORDERS, JSON.stringify(SEED_ORDERS));
    }
    if (!localStorage.getItem(KEY_INTAKE)) {
      localStorage.setItem(KEY_INTAKE, JSON.stringify(SEED_INTAKE));
    }
    if (!localStorage.getItem(KEY_CART)) {
      localStorage.setItem(KEY_CART, JSON.stringify([]));
    }
  }

  /* Role: "buyer" (Modum kommune) or "admin" (Re:textile). */
  function getRole() {
    return localStorage.getItem(KEY_ROLE);
  }
  function setRole(role) {
    localStorage.setItem(KEY_ROLE, role);
  }
  function clearRole() {
    localStorage.removeItem(KEY_ROLE);
  }

  function getListings() {
    return JSON.parse(localStorage.getItem(KEY_LISTINGS) || "[]");
  }
  function saveListings(list) {
    localStorage.setItem(KEY_LISTINGS, JSON.stringify(list));
  }
  function getListing(id) {
    return getListings().find((l) => l.id === id);
  }

  function getCart() {
    return JSON.parse(localStorage.getItem(KEY_CART) || "[]");
  }
  function saveCart(cart) {
    localStorage.setItem(KEY_CART, JSON.stringify(cart));
  }

  function getOrders() {
    return JSON.parse(localStorage.getItem(KEY_ORDERS) || "[]");
  }
  function saveOrders(orders) {
    localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
  }
  /** Orders placed by the logged-in municipality (buyer view). */
  function getMyOrders() {
    return getOrders().filter((o) => o.buyer === MY_MUNICIPALITY);
  }

  function getIntake() {
    return JSON.parse(localStorage.getItem(KEY_INTAKE) || "[]");
  }
  function saveIntake(list) {
    localStorage.setItem(KEY_INTAKE, JSON.stringify(list));
  }

  function addToCart(listingId, quantity) {
    const cart = getCart();
    const existing = cart.find((i) => i.listingId === listingId);
    const listing = getListing(listingId);
    if (!listing) return;
    const maxQty = listing.quantity;
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, maxQty);
    } else {
      cart.push({ listingId, quantity: Math.min(quantity, maxQty) });
    }
    saveCart(cart);
  }

  function updateCartQuantity(listingId, quantity) {
    const cart = getCart();
    const item = cart.find((i) => i.listingId === listingId);
    if (!item) return;
    const listing = getListing(listingId);
    const maxQty = listing ? listing.quantity : quantity;
    item.quantity = Math.max(1, Math.min(quantity, maxQty));
    saveCart(cart);
  }

  function removeFromCart(listingId) {
    saveCart(getCart().filter((i) => i.listingId !== listingId));
  }

  function cartCount() {
    return getCart().reduce((sum, i) => sum + i.quantity, 0);
  }

  function cartDetails() {
    const listings = getListings();
    return getCart()
      .map((item) => {
        const listing = listings.find((l) => l.id === item.listingId);
        if (!listing) return null;
        return { ...item, listing };
      })
      .filter(Boolean);
  }

  function cartTotal() {
    return cartDetails().reduce((sum, i) => sum + i.quantity * i.listing.price, 0);
  }

  /** Places one order with Re:textile for everything in the cart,
   *  decrements listing quantities, clears the cart and returns the
   *  new order id (or null if the cart was empty). */
  function placeOrder() {
    const details = cartDetails();
    if (details.length === 0) return null;

    const orders = getOrders();
    const listings = getListings();
    const orderId = "B-" + Math.floor(1000 + Math.random() * 9000);

    orders.unshift({
      id: orderId,
      date: new Date().toISOString().slice(0, 10),
      buyer: MY_MUNICIPALITY,
      items: details.map((i) => ({
        title: i.listing.title,
        quantity: i.quantity,
        price: i.listing.price,
      })),
      status: "Venter",
    });

    details.forEach((i) => {
      const listing = listings.find((l) => l.id === i.listing.id);
      if (listing) listing.quantity = Math.max(0, listing.quantity - i.quantity);
    });

    saveOrders(orders);
    saveListings(listings);
    saveCart([]);
    return orderId;
  }

  /** Advance an order to the next status in ORDER_FLOW (admin view). */
  function advanceOrder(id) {
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const idx = ORDER_FLOW.indexOf(order.status);
    if (idx > -1 && idx < ORDER_FLOW.length - 1) {
      order.status = ORDER_FLOW[idx + 1];
      saveOrders(orders);
    }
  }

  /** Register a garment received from a municipality (admin view). */
  function addIntake(item) {
    const list = getIntake();
    const nextId = list.reduce((max, i) => Math.max(max, i.id), 100) + 1;
    list.unshift({
      id: nextId,
      received: new Date().toISOString().slice(0, 10),
      status: "Til kontroll",
      ...item,
    });
    saveIntake(list);
  }

  /** Move an intake garment to the next processing step. */
  function advanceIntake(id) {
    const list = getIntake();
    const item = list.find((i) => i.id === id);
    if (!item) return;
    const idx = INTAKE_FLOW.indexOf(item.status);
    if (idx > -1 && idx < INTAKE_FLOW.length - 1) {
      item.status = INTAKE_FLOW[idx + 1];
      saveIntake(list);
    }
  }

  /** Publish a "Klar for salg" intake garment as a listing and drop it
   *  from the intake list. Returns the new listing or null. */
  function publishIntake(id) {
    const list = getIntake();
    const item = list.find((i) => i.id === id);
    if (!item || item.status !== "Klar for salg") return null;

    const record = addListing({
      title: item.title,
      category: item.category,
      size: item.size,
      price: SUGGESTED_PRICE[item.category] || 250,
      quantity: item.quantity,
      origin: item.origin,
      condition: "Kontrollert",
      description: "Kontrollert og klargjort av Re:textile.",
    });

    saveIntake(list.filter((i) => i.id !== id));
    return record;
  }

  function addListing(listing) {
    const listings = getListings();
    const nextId = listings.reduce((max, l) => Math.max(max, l.id), 0) + 1;
    const record = { id: nextId, condition: "Kontrollert", ...listing };
    if (!record.origin) record.origin = MY_MUNICIPALITY;
    listings.unshift(record);
    saveListings(listings);
    return record;
  }

  /** Headline numbers for the admin dashboard. */
  function stats() {
    const intake = getIntake();
    const listings = getListings();
    const orders = getOrders();
    return {
      intakeInProgress: intake
        .filter((i) => i.status !== "Klar for salg")
        .reduce((s, i) => s + i.quantity, 0),
      intakeReady: intake
        .filter((i) => i.status === "Klar for salg")
        .reduce((s, i) => s + i.quantity, 0),
      stockUnits: listings.reduce((s, l) => s + l.quantity, 0),
      openOrders: orders.filter((o) => o.status !== "Levert").length,
    };
  }

  function formatPrice(n) {
    return n.toLocaleString("nb-NO") + " kr";
  }

  function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(cartCount());
    });
  }

  return {
    init,
    MY_MUNICIPALITY,
    SELLER,
    MUNICIPALITIES,
    getRole,
    setRole,
    clearRole,
    getListings,
    saveListings,
    getListing,
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartCount,
    cartDetails,
    cartTotal,
    placeOrder,
    getOrders,
    getMyOrders,
    advanceOrder,
    getIntake,
    addIntake,
    advanceIntake,
    publishIntake,
    addListing,
    stats,
    formatPrice,
    updateCartBadge,
  };
})();

Store.init();
