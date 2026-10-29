
"use strict";

// ============================================
// FRESCOMARK - DATOS DE DEMOSTRACIÓN
// ============================================

const products = [
  {
    id: 1, name: "Manzanas rojas", category: "Frutas y verduras",
    description: "Por kilogramo", price: 12, oldPrice: 15,
    badge: "OFERTA", featured: true,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2, name: "Leche entera", category: "Lácteos",
    description: "Envase de 1 litro", price: 8.5, oldPrice: null,
    badge: "POPULAR", featured: true,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3, name: "Pan artesanal", category: "Panadería",
    description: "Pan recién horneado", price: 6, oldPrice: null,
    badge: null, featured: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4, name: "Jugo de naranja", category: "Bebidas",
    description: "Botella de 1 litro", price: 10, oldPrice: 12,
    badge: "OFERTA", featured: true,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5, name: "Plátanos", category: "Frutas y verduras",
    description: "Por kilogramo", price: 7.5, oldPrice: null,
    badge: null, featured: true,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6, name: "Queso fresco", category: "Lácteos",
    description: "Presentación de 400 g", price: 22, oldPrice: null,
    badge: null, featured: false,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7, name: "Arroz", category: "Despensa",
    description: "Bolsa de 1 kilogramo", price: 9, oldPrice: 11,
    badge: "OFERTA", featured: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8, name: "Tomates frescos", category: "Frutas y verduras",
    description: "Por kilogramo", price: 8, oldPrice: null,
    badge: null, featured: false,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 9, name: "Aceite vegetal", category: "Despensa",
    description: "Botella de 900 ml", price: 16, oldPrice: null,
    badge: null, featured: false,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 10, name: "Agua mineral", category: "Bebidas",
    description: "Botella de 2 litros", price: 5, oldPrice: null,
    badge: null, featured: false,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 11, name: "Galletas integrales", category: "Despensa",
    description: "Paquete de 200 g", price: 11, oldPrice: 13,
    badge: "OFERTA", featured: false,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 12, name: "Detergente", category: "Limpieza",
    description: "Presentación de 1 kg", price: 18, oldPrice: null,
    badge: null, featured: false,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 13, name: "Zanahorias", category: "Frutas y verduras",
    description: "Por kilogramo", price: 6, oldPrice: null,
    badge: null, featured: false,
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 14, name: "Yogur natural", category: "Lácteos",
    description: "Envase de 1 litro", price: 14, oldPrice: null,
    badge: "POPULAR", featured: false,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80"
  }
];

// ============================================
// ESTADO DE LA TIENDA
// ============================================

const state = {
  category: "Todos",
  search: "",
  sort: "featured",
  offersOnly: false,
  cart: new Map(),
  user: null
};

const $ = (selector) => document.querySelector(selector);

const productGrid = $("#productGrid");
const resultLine = $("#resultLine");
const emptyState = $("#emptyState");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
const loginModal = $("#loginModal");
const checkoutModal = $("#checkoutModal");
const successModal = $("#successModal");
const toast = $("#toast");

let toastTimer;

// Formato monetario en bolivianos.
function money(amount) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace("BOB", "Bs").replace("Bs", "Bs");
}

// Escapa texto antes de introducir datos del usuario en HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ============================================
// CATÁLOGO, BUSCADOR Y FILTROS
// ============================================

function getVisibleProducts() {
  let list = products.filter(product => {
    const term = state.search.trim().toLocaleLowerCase("es");

    const matchesSearch =
      !term ||
      product.name.toLocaleLowerCase("es").includes(term) ||
      product.category.toLocaleLowerCase("es").includes(term) ||
      product.description.toLocaleLowerCase("es").includes(term);

    const matchesCategory =
      state.category === "Todos" ||
      product.category === state.category;

    const matchesOffers =
      !state.offersOnly || product.oldPrice !== null;

    return matchesSearch && matchesCategory && matchesOffers;
  });

  switch (state.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    default:
      list.sort((a, b) =>
        Number(b.featured) - Number(a.featured) || a.id - b.id
      );
  }

  return list;
}

function renderProducts() {
  const list = getVisibleProducts();

  $("#productsTitle").textContent = state.offersOnly
    ? "Ofertas especiales"
    : state.category === "Todos"
      ? "Productos destacados"
      : state.category;

  resultLine.textContent = `${list.length} producto${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}`;

  emptyState.classList.toggle("hidden", list.length > 0);
  productGrid.classList.toggle("hidden", list.length === 0);

  productGrid.innerHTML = list.map(product => {
    const badge = product.badge
      ? `<span class="product-badge ${product.oldPrice ? "sale" : ""}">${product.badge}</span>`
      : "";

    const oldPrice = product.oldPrice
      ? `<span class="old-price">${money(product.oldPrice)}</span>`
      : "";

    return `
      <article class="product-card">
        <div class="product-image">
          <img src="${product.image}"
            alt="${escapeHTML(product.name)}"
            loading="lazy">
          ${badge}
        </div>
        <div class="product-info">
          <span class="product-category">${escapeHTML(product.category)}</span>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="product-description">${escapeHTML(product.description)}</p>
          <div class="product-bottom">
            <div class="product-price">
              ${oldPrice}
              <strong>${money(product.price)}</strong>
            </div>
            <button class="add-button" data-add="${product.id}"
              aria-label="Agregar ${escapeHTML(product.name)} al carrito"
              title="Agregar al carrito">+</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setCategory(category) {
  state.category = category;
  state.offersOnly = false;

  document.querySelectorAll(".category-card").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });

  renderProducts();
}

$("#categoryGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  state.search = $("#searchInput").value;
  renderProducts();
  $("#productos").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", event => {
  state.search = event.target.value;
  renderProducts();
});

$("#sortSelect").addEventListener("change", event => {
  state.sort = event.target.value;
  renderProducts();
});

function showOffers() {
  state.offersOnly = true;
  state.category = "Todos";
  state.search = "";
  $("#searchInput").value = "";
  $("#categoryGrid").querySelectorAll(".category-card").forEach(button => {
    button.classList.toggle("active", button.dataset.category === "Todos");
  });
  renderProducts();
  $("#productos").scrollIntoView({ behavior: "smooth" });
}

$("#offersButton").addEventListener("click", showOffers);

$("#resetButton").addEventListener("click", () => {
  state.category = "Todos";
  state.search = "";
  state.offersOnly = false;
  state.sort = "featured";
  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  setCategory("Todos");
});

// ============================================
// CARRITO DE COMPRAS
// ============================================

function getCartItems() {
  return [...state.cart.entries()].map(([id, quantity]) => ({
    product: products.find(product => product.id === id),
    quantity
  })).filter(item => item.product);
}

function getCartCount() {
  return [...state.cart.values()].reduce((sum, quantity) => sum + quantity, 0);
}

function getCartTotal() {
  return getCartItems().reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  renderCart();
  notify(`${product.name} se agregó al carrito.`);
}

function changeQuantity(id, delta) {
  const next = (state.cart.get(id) || 0) + delta;

  if (next <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, next);
  }

  renderCart();
}

function renderCart() {
  const items = getCartItems();
  const count = getCartCount();
  const total = getCartTotal();

  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = money(total);
  $("#cartTotal").textContent = money(total);

  $("#cartItems").innerHTML = items.map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${product.image}" alt="${escapeHTML(product.name)}">
      <div>
        <h3>${escapeHTML(product.name)}</h3>
        <div class="cart-unit-price">${money(product.price)} por unidad</div>
        <div class="quantity-control">
          <button data-quantity="${product.id}" data-delta="-1"
            aria-label="Reducir cantidad">−</button>
          <span>${quantity}</span>
          <button data-quantity="${product.id}" data-delta="1"
            aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <strong class="cart-item-price">${money(product.price * quantity)}</strong>
    </article>
  `).join("");

  $("#cartEmpty").classList.toggle("hidden", items.length > 0);
  $("#cartSummary").classList.toggle("hidden", items.length === 0);
  $("#checkoutTotal").textContent = money(total);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

$("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-quantity]");
  if (button) {
    changeQuantity(Number(button.dataset.quantity), Number(button.dataset.delta));
  }
});

// ============================================
// VENTANAS, CARRITO Y ACCESO SIMULADO
// ============================================

function openPanel(panel) {
  closePanels();

  overlay.classList.remove("hidden");
  panel.classList.remove("hidden");
  document.body.classList.add("locked");

  if (panel === cartDrawer) {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  }

  const focusTarget = panel.querySelector("input, button, select");
  if (focusTarget) setTimeout(() => focusTarget.focus(), 100);
}

function closePanels() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  [loginModal, checkoutModal, successModal].forEach(panel => {
    panel.classList.add("hidden");
  });
  overlay.classList.add("hidden");
  document.body.classList.remove("locked");
}

$("#cartButton").addEventListener("click", () => openPanel(cartDrawer));
$("#loginButton").addEventListener("click", () => openPanel(loginModal));
$("#footerLogin").addEventListener("click", () => openPanel(loginModal));
$("#footerCart").addEventListener("click", () => openPanel(cartDrawer));
overlay.addEventListener("click", closePanels);

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", closePanels);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePanels();
});

$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#loginName").value.trim();
  const email = $("#loginEmail").value.trim();

  if (name.length < 2 || !email) {
    notify("Completa correctamente los datos.");
    return;
  }

  state.user = { name, email };
  $("#accountLabel").textContent = name.split(/\s+/)[0];
  closePanels();
  event.target.reset();
  notify(`¡Bienvenido/a, ${name.split(/\s+/)[0]}! Acceso simulado correcto.`);
});

// ============================================
// FORMULARIO Y CONFIRMACIÓN DEL PEDIDO
// ============================================

$("#checkoutButton").addEventListener("click", () => {
  if (state.cart.size === 0) {
    notify("Agrega al menos un producto antes de continuar.");
    return;
  }

  if (state.user) {
    $("#customerName").value = state.user.name;
  }

  openPanel(checkoutModal);
});

$("#checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  const items = getCartItems();
  if (items.length === 0) {
    closePanels();
    notify("Tu carrito está vacío.");
    return;
  }

  const name = $("#customerName").value.trim();
  const phone = $("#customerPhone").value.trim();
  const address = $("#customerAddress").value.trim();
  const delivery = $("#deliveryMethod").value;
  const notes = $("#orderNotes").value.trim();

  if (name.length < 2 || phone.length < 7 || address.length < 5) {
    notify("Revisa los datos del formulario.");
    return;
  }

  const total = getCartTotal();
  const orderNumber = "FM-" + Date.now().toString().slice(-7);

  $("#successMessage").textContent =
    `Gracias, ${name}. Tu pedido de demostración está registrado. No se ha realizado ningún cobro.`;

  $("#receipt").innerHTML = `
    <div class="receipt-row"><span>Pedido</span><strong>${orderNumber}</strong></div>
    <div class="receipt-row"><span>Cliente</span><strong>${escapeHTML(name)}</strong></div>
    <div class="receipt-row"><span>Teléfono</span><strong>${escapeHTML(phone)}</strong></div>
    <div class="receipt-row"><span>Dirección</span><strong>${escapeHTML(address)}</strong></div>
    <div class="receipt-row"><span>Entrega</span><strong>${escapeHTML(delivery)}</strong></div>
    ${items.map(({ product, quantity }) => `
      <div class="receipt-row">
        <span>${escapeHTML(product.name)} × ${quantity}</span>
        <strong>${money(product.price * quantity)}</strong>
      </div>
    `).join("")}
    ${notes ? `<div class="receipt-row"><span>Notas</span><strong>${escapeHTML(notes)}</strong></div>` : ""}
    <div class="receipt-row receipt-total"><span>Total estimado</span><strong>${money(total)}</strong></div>
    <div class="receipt-row"><span>Estado</span><strong>Simulación académica</strong></div>
  `;

  state.cart.clear();
  renderCart();
  event.target.reset();
  openPanel(successModal);
});

$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = $("#newsletterEmail").value.trim();
  if (!email) return;

  event.target.reset();
  notify("¡Suscripción de demostración completada!");
});

// ============================================
// INICIALIZACIÓN
// ============================================

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
