/* Tiny localStorage-backed "store". No backend — state just needs to
   feel persistent while clicking around the demo. */

const Store = (() => {
  const KEY_LISTINGS = "wwm_listings";
  const KEY_CART = "wwm_cart";
  const KEY_ORDERS = "wwm_orders";

  function init() {
    if (!localStorage.getItem(KEY_LISTINGS)) {
      localStorage.setItem(KEY_LISTINGS, JSON.stringify(SEED_LISTINGS));
    }
    if (!localStorage.getItem(KEY_ORDERS)) {
      localStorage.setItem(KEY_ORDERS, JSON.stringify(SEED_ORDERS));
    }
    if (!localStorage.getItem(KEY_CART)) {
      localStorage.setItem(KEY_CART, JSON.stringify([]));
    }
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

  /** Places an order per seller municipality, decrements listing quantities,
   *  clears the cart and returns the newly created order ids. */
  function placeOrder() {
    const details = cartDetails();
    if (details.length === 0) return [];

    const byMunicipality = {};
    details.forEach((d) => {
      (byMunicipality[d.listing.municipality] ||= []).push(d);
    });

    const orders = getOrders();
    const listings = getListings();
    const newIds = [];

    Object.entries(byMunicipality).forEach(([municipality, items]) => {
      const orderId = "B-" + Math.floor(1000 + Math.random() * 9000);
      orders.unshift({
        id: orderId,
        date: new Date().toISOString().slice(0, 10),
        direction: "sent",
        counterparty: municipality,
        items: items.map((i) => ({
          title: i.listing.title,
          quantity: i.quantity,
          price: i.listing.price,
        })),
        status: "Venter",
      });
      newIds.push(orderId);

      items.forEach((i) => {
        const listing = listings.find((l) => l.id === i.listing.id);
        if (listing) listing.quantity = Math.max(0, listing.quantity - i.quantity);
      });
    });

    saveOrders(orders);
    saveListings(listings);
    saveCart([]);
    return newIds;
  }

  function addListing(listing) {
    const listings = getListings();
    const nextId = listings.reduce((max, l) => Math.max(max, l.id), 0) + 1;
    const record = { id: nextId, municipality: MY_MUNICIPALITY, ...listing };
    listings.unshift(record);
    saveListings(listings);
    return record;
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
    addListing,
    formatPrice,
    updateCartBadge,
  };
})();

Store.init();
