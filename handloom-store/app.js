// ─── PRODUCT DATA ───────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "Royal Silk Kanjivaram Saree", craft: "Kanjivaram",
    price: 12499, originalPrice: 18000, category: "sarees",
    image: "images/saree.png", badge: "Bestseller", badgeClass: "",
    rating: 4.8, reviews: 234, off: "31%",
    description: "This exquisite Kanjivaram silk saree features traditional temple border with intricate zari work. Handwoven by master weavers in Tamil Nadu using pure mulberry silk.",
    material: "Pure Silk", origin: "Tamil Nadu", weavingTime: "3-4 weeks", sizes: ["5.5m", "6m", "6.5m"]
  },
  {
    id: 2, name: "Geometric Ikat Dhurrie Rug", craft: "Ikat Weave",
    price: 4299, originalPrice: 6500, category: "home-decor",
    image: "images/dhurrie_rug.png", badge: "Sale", badgeClass: "",
    rating: 4.6, reviews: 89, off: "34%",
    description: "Handwoven cotton dhurrie with bold geometric ikat patterns. Double-sided design in terracotta, indigo and cream. Perfect for living rooms and dining spaces.",
    material: "Handspun Cotton", origin: "Rajasthan", weavingTime: "1-2 weeks", sizes: ["3×5 ft", "4×6 ft", "5×8 ft"]
  },
  {
    id: 3, name: "Banarasi Silk Dupatta", craft: "Banarasi",
    price: 3299, originalPrice: 4800, category: "dupattas",
    image: "images/dupatta.png", badge: "New", badgeClass: "new-badge",
    rating: 4.9, reviews: 156, off: "31%",
    description: "Luxurious Banarasi dupatta woven with golden zari on crimson silk. Features traditional floral motifs and a rich pallu with elaborate border design.",
    material: "Pure Silk + Zari", origin: "Varanasi", weavingTime: "2-3 weeks", sizes: ["2.25m", "2.5m"]
  },
  {
    id: 4, name: "Handwoven Cushion Cover Set", craft: "Block Loom",
    price: 1499, originalPrice: 2200, category: "home-decor",
    image: "images/cushion_cover.png", badge: "", badgeClass: "",
    rating: 4.5, reviews: 312, off: "32%",
    description: "Set of 2 handloom cotton cushion covers with traditional block-woven patterns in mustard and teal. Eco-friendly, machine washable.",
    material: "Handspun Cotton", origin: "Gujarat", weavingTime: "3-5 days", sizes: ['16"×16"', '18"×18"', '20"×20"']
  },
  {
    id: 5, name: "Pashmina Stole with Embroidery", craft: "Pashmina",
    price: 7999, originalPrice: 11000, category: "stoles",
    image: "images/stole.png", badge: "Handcrafted", badgeClass: "new-badge",
    rating: 4.9, reviews: 78, off: "27%",
    description: "Pure pashmina wool stole with hand-embroidered borders in ivory and forest green. 100% natural fiber, lightweight yet incredibly warm.",
    material: "Pure Pashmina", origin: "Kashmir", weavingTime: "4-6 weeks", sizes: ["2m × 0.7m"]
  },
  {
    id: 6, name: "Chanderi Cotton-Silk Saree", craft: "Chanderi",
    price: 6899, originalPrice: 9500, category: "sarees",
    image: "images/saree.png", badge: "", badgeClass: "",
    rating: 4.7, reviews: 198, off: "27%",
    description: "Elegant Chanderi saree in delicate cotton-silk blend with sheer texture. Features traditional butis and a contrasting zari border, perfect for festive occasions.",
    material: "Cotton-Silk Blend", origin: "Madhya Pradesh", weavingTime: "2-3 weeks", sizes: ["5.5m", "6m"]
  },
  {
    id: 7, name: "Phulkari Embroidered Dupatta", craft: "Phulkari",
    price: 2799, originalPrice: 4000, category: "dupattas",
    image: "images/dupatta.png", badge: "Sale", badgeClass: "",
    rating: 4.6, reviews: 145, off: "30%",
    description: "Vibrant Phulkari dupatta with dense floral embroidery in silk thread on handloom cotton base. A celebration of Punjabi textile artistry.",
    material: "Cotton + Silk Thread", origin: "Punjab", weavingTime: "3-4 weeks", sizes: ["2.25m", "2.5m"]
  },
  {
    id: 8, name: "Jamdani Cotton Saree", craft: "Jamdani",
    price: 9499, originalPrice: 13000, category: "sarees",
    image: "images/saree.png", badge: "Premium", badgeClass: "new-badge",
    rating: 5.0, reviews: 43, off: "27%",
    description: "UNESCO heritage Jamdani saree with intricate supplementary weft patterns. Every motif is woven by hand thread by thread — a true collector's piece.",
    material: "Fine Muslin Cotton", origin: "West Bengal", weavingTime: "6-8 weeks", sizes: ["6m"]
  }
];

// ─── CART MANAGEMENT ─────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('handloom_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('handloom_wishlist') || '[]');

function saveCart() {
  localStorage.setItem('handloom_cart', JSON.stringify(cart));
  updateCartBadge();
}
function saveWishlist() {
  localStorage.setItem('handloom_wishlist', JSON.stringify(wishlist));
}
function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = total || '');
}
function addToCart(productId, qty = 1, size = null) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const existing = cart.find(i => i.id === productId && i.size === size);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, craft: p.craft, qty, size }); }
  saveCart();
  showToast(`🛒 "${p.name}" added to cart!`);
  bounceButton();
}
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
}
function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
}
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) { wishlist.splice(idx, 1); showToast('💔 Removed from wishlist'); }
  else { wishlist.push(productId); showToast('❤️ Added to wishlist!'); }
  saveWishlist();
  return wishlist.includes(productId);
}
function bounceButton() {
  const badge = document.querySelectorAll('.cart-badge');
  badge.forEach(b => { b.style.animation = 'none'; b.offsetHeight; b.style.animation = 'bounce 0.4s'; });
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">✨</span>${message}`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── PRODUCT CARD RENDERER ────────────────────────────────────────────────────
function renderProductCard(p) {
  const wished = wishlist.includes(p.id);
  return `
    <div class="product-card" onclick="window.location='product-detail.html?id=${p.id}'">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge ${p.badgeClass}">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn ${wished ? 'wished' : ''}" onclick="event.stopPropagation(); toggleWishlistCard(this, ${p.id})" title="Wishlist">
            ${wished ? '❤️' : '🤍'}
          </button>
          <button class="action-btn" onclick="event.stopPropagation(); window.location='product-detail.html?id=${p.id}'" title="Quick View">👁️</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-craft">${p.craft}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '☆' : ''}</span>
          <span class="rating-count">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
          <span class="price-off">${p.off} off</span>
        </div>
        <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`;
}

function toggleWishlistCard(btn, id) {
  const inWish = toggleWishlist(id);
  btn.textContent = inWish ? '❤️' : '🤍';
  btn.classList.toggle('wished', inWish);
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function initNavbar() {
  updateCartBadge();
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function initHomePage() {
  const featGrid = document.getElementById('featured-products');
  if (featGrid) {
    featGrid.innerHTML = PRODUCTS.slice(0, 4).map(renderProductCard).join('');
  }
  const newGrid = document.getElementById('new-arrivals');
  if (newGrid) {
    newGrid.innerHTML = PRODUCTS.slice(4).map(renderProductCard).join('');
  }
  // Newsletter
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('🎉 Subscribed! Welcome to Tantushala family.');
      form.reset();
    });
  }
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
let filteredProducts = [...PRODUCTS];
let activeCategory = 'all';

function initProductsPage() {
  renderProductsGrid(PRODUCTS);
  // Category filter
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      applyFilters();
    });
  });
  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  // Checkboxes
  document.querySelectorAll('.filter-option input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
  // Price range
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      document.getElementById('price-max-label').textContent = '₹' + parseInt(priceRange.value).toLocaleString('en-IN');
      applyFilters();
    });
  }
  // Search
  const searchBox = document.getElementById('product-search');
  if (searchBox) searchBox.addEventListener('input', applyFilters);
}

function applyFilters() {
  const searchQ = (document.getElementById('product-search')?.value || '').toLowerCase();
  const maxPrice = parseInt(document.getElementById('price-range')?.value || 20000);
  const checkedCrafts = [...document.querySelectorAll('.craft-filter:checked')].map(c => c.value);
  const sortVal = document.getElementById('sort-select')?.value || 'default';

  let results = PRODUCTS.filter(p => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const priceMatch = p.price <= maxPrice;
    const craftMatch = checkedCrafts.length === 0 || checkedCrafts.includes(p.craft);
    const searchMatch = !searchQ || p.name.toLowerCase().includes(searchQ) || p.craft.toLowerCase().includes(searchQ);
    return catMatch && priceMatch && craftMatch && searchMatch;
  });

  if (sortVal === 'price-asc') results.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price-desc') results.sort((a, b) => b.price - a.price);
  else if (sortVal === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sortVal === 'newest') results.reverse();

  renderProductsGrid(results);
}

function renderProductsGrid(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const count = document.getElementById('results-count');
  if (count) count.textContent = `Showing ${products.length} products`;
  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">No products found matching your filters.</div>';
    return;
  }
  grid.innerHTML = products.map(renderProductCard).join('');
}

// ─── PRODUCT DETAIL PAGE ─────────────────────────────────────────────────────
function initProductDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  document.getElementById('detail-craft').textContent = product.craft;
  document.getElementById('detail-name').textContent = product.name;
  document.getElementById('detail-rating-stars').textContent = '★'.repeat(Math.floor(product.rating));
  document.getElementById('detail-rating-val').textContent = product.rating;
  document.getElementById('detail-review-count').textContent = `(${product.reviews} reviews)`;
  document.getElementById('detail-price').textContent = '₹' + product.price.toLocaleString('en-IN');
  document.getElementById('detail-original').textContent = '₹' + product.originalPrice.toLocaleString('en-IN');
  document.getElementById('detail-off').textContent = product.off + ' off';
  document.getElementById('detail-desc').textContent = product.description;
  document.getElementById('detail-material').textContent = product.material;
  document.getElementById('detail-origin').textContent = product.origin;
  document.getElementById('detail-weaving-time').textContent = product.weavingTime;
  document.getElementById('detail-craft-type').textContent = product.craft;

  // Images
  document.querySelectorAll('.gallery-main img, .gallery-thumb img').forEach(img => {
    img.src = product.image; img.alt = product.name;
  });

  // Sizes
  const sizesContainer = document.getElementById('size-options');
  if (sizesContainer) {
    sizesContainer.innerHTML = product.sizes.map((s, i) =>
      `<button class="size-btn ${i === 0 ? 'active' : ''}" onclick="selectSize(this)">${s}</button>`
    ).join('');
  }

  // Related products
  const relGrid = document.getElementById('related-products');
  if (relGrid) {
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const display = related.length ? related : PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
    relGrid.innerHTML = display.map(renderProductCard).join('');
  }

  // Add to cart button
  const addBtn = document.getElementById('detail-add-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const activeSize = document.querySelector('.size-btn.active')?.textContent || null;
      addToCart(product.id, 1, activeSize);
    });
  }

  // Wishlist btn
  const wishBtn = document.getElementById('detail-wishlist-btn');
  if (wishBtn) {
    const inWish = wishlist.includes(product.id);
    wishBtn.textContent = inWish ? '❤️' : '🤍';
    wishBtn.addEventListener('click', () => {
      const now = toggleWishlist(product.id);
      wishBtn.textContent = now ? '❤️' : '🤍';
    });
  }
}

function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── CART PAGE ───────────────────────────────────────────────────────────────
function initCartPage() {
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  if (!container) return;

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-craft">${item.craft}</div>
        <div class="cart-item-name">${item.name}</div>
        ${item.size ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-top:3px">Size: ${item.size}</div>` : ''}
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val" id="qty-${item.id}">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
      <button class="remove-btn" onclick="deleteItem(${item.id})" title="Remove">✕</button>
    </div>
  `).join('');

  updateSummary();
}

function changeQty(id, delta) {
  updateQty(id, delta);
  const qtyEl = document.getElementById(`qty-${id}`);
  if (qtyEl) qtyEl.textContent = cart.find(i => i.id === id)?.qty || 0;
  updateSummary();
}

function deleteItem(id) {
  removeFromCart(id);
  renderCart();
}

function updateSummary() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  const discount = Math.floor(subtotal * 0.05);
  const total = subtotal - discount + shipping;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-subtotal', '₹' + subtotal.toLocaleString('en-IN'));
  set('summary-shipping', shipping === 0 ? 'FREE' : '₹' + shipping);
  set('summary-discount', '−₹' + discount.toLocaleString('en-IN'));
  set('summary-total', '₹' + total.toLocaleString('en-IN'));
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────
function initCheckoutPage() {
  const container = document.getElementById('mini-cart-items');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">Your cart is empty.</p>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="mini-cart-item">
      <img class="mini-cart-img" src="${item.image}" alt="${item.name}">
      <div>
        <div class="mini-item-name">${item.name}</div>
        <div style="font-size:0.78rem;color:var(--text-muted)">Qty: ${item.qty}</div>
        <div class="mini-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
      </div>
    </div>`).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  const discount = Math.floor(subtotal * 0.05);
  const total = subtotal - discount + shipping;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('co-subtotal', '₹' + subtotal.toLocaleString('en-IN'));
  set('co-shipping', shipping === 0 ? 'FREE' : '₹' + shipping);
  set('co-discount', '−₹' + discount.toLocaleString('en-IN'));
  set('co-total', '₹' + total.toLocaleString('en-IN'));

  // Payment option selection
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input[type=radio]').checked = true;
    });
  });

  // Place order
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      cart = []; saveCart();
      window.location.href = 'index.html?order=success';
    });
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  const page = document.body.dataset.page;
  if (page === 'home') initHomePage();
  else if (page === 'products') initProductsPage();
  else if (page === 'product-detail') initProductDetailPage();
  else if (page === 'cart') initCartPage();
  else if (page === 'checkout') initCheckoutPage();

  // Order success message
  const params = new URLSearchParams(window.location.search);
  if (params.get('order') === 'success') {
    setTimeout(() => showToast('🎉 Order placed! Thank you for shopping with Tantushala!'), 500);
  }
});
