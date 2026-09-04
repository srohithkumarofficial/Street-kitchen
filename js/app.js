// Street Kitchen - Enhanced Application Engine with Mobile Drawer & WhatsApp Sync

// Global State
let threeSceneInstance = null;
let cart = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initThreeHero();
  initHeaderScroll();
  initMobileDrawer();
  renderMenu('all');
  initCategoryFilters();
  initCartDrawer();
  initReservationModal();
  initLeafletMap();
  initFloatingTrayBar();
  initScrollReveal();
});

/* ==========================================================================
   1. MOBILE DRAWER & HEADER SCROLL
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileDrawer() {
  const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   2. THREE.JS 3D HERO SHOWCASE
   ========================================================================== */
function initThreeHero() {
  try {
    threeSceneInstance = new Street3DScene('three-canvas-container');

    const tabBtns = document.querySelectorAll('.model-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const modelIndex = parseInt(btn.dataset.modelIndex, 10);
        if (threeSceneInstance) {
          threeSceneInstance.switchModel(modelIndex);
        }
      });
    });
  } catch (e) {
    console.error("Three.js initialization error:", e);
  }
}

/* ==========================================================================
   3. MENU RENDERING & CARDS
   ========================================================================== */
function renderMenu(category = 'all') {
  const grid = document.getElementById('menu-cards-grid');
  if (!grid) return;

  const items = category === 'all' 
    ? MENU_DATA 
    : MENU_DATA.filter(item => item.category === category);

  grid.innerHTML = items.map(item => `
    <article class="dish-card-wrapper scroll-reveal visible" data-id="${item.id}">
      <div class="card-image-wrap">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="card-image-overlay"></div>
        <div class="card-top-badges">
          <span class="dish-badge ${item.badge === 'Bestseller' ? 'bestseller' : ''}">${item.badge}</span>
          <div class="veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
            <div class="veg-dot"></div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta-top">
          <div class="card-spicy-meter" title="Spice Level ${item.spicyLevel}/3">
            ${'🌶️'.repeat(item.spicyLevel) || '🟢 Mild'}
          </div>
          <div class="card-rating">
            ★ ${item.rating} <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4)">(${item.reviews})</span>
          </div>
        </div>
        <h3 class="dish-name">${item.name}</h3>
        <p class="dish-desc">${item.description}</p>
        <div class="dish-tags">
          ${item.tags.map(t => `<span class="dish-tag">#${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="dish-price"><span>₹</span>${item.price}</div>
          <button class="btn-add-cart" onclick="addToCart('${item.id}', event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add to Tray
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      currentCategory = cat;
      renderMenu(cat);
    });
  });
}

/* ==========================================================================
   4. ENHANCED CART & TRAY MANAGEMENT (NON-INTRUSIVE & NON-OVERLAPPING)
   ========================================================================== */
function addToCart(dishId, event) {
  const dish = MENU_DATA.find(d => d.id === dishId);
  if (!dish) return;

  const existing = cart.find(item => item.id === dishId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...dish, qty: 1 });
  }

  showToast(`Added <strong>${dish.name}</strong> to Tray!`);

  const badge = document.getElementById('nav-cart-count');
  if (badge) {
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 250);
  }

  updateCartUI();
}

function updateCartQty(dishId, delta) {
  const itemIndex = cart.findIndex(item => item.id === dishId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const countBadges = document.querySelectorAll('.cart-count-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  countBadges.forEach(b => b.textContent = totalItems);

  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const totalEl = document.getElementById('cart-total-val');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  // Floating Bottom Tray Bar & WhatsApp Widget Sync
  const trayBar = document.getElementById('floating-tray-bar');
  const trayBarCount = document.getElementById('tray-bar-count');
  const trayBarSubtotal = document.getElementById('tray-bar-subtotal');
  const floatingWaWidget = document.getElementById('floating-whatsapp-widget');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packagingFee = 20;
  const grandTotal = subtotal > 0 ? subtotal + packagingFee : 0;

  if (trayBar) {
    if (totalItems > 0) {
      trayBar.classList.add('visible');
      if (floatingWaWidget) floatingWaWidget.classList.add('tray-active'); // shifts WA widget up to avoid overlap
      if (trayBarCount) trayBarCount.textContent = `${totalItems} ITEM${totalItems > 1 ? 'S' : ''}`;
      if (trayBarSubtotal) trayBarSubtotal.textContent = `₹${subtotal}`;
    } else {
      trayBar.classList.remove('visible');
      if (floatingWaWidget) floatingWaWidget.classList.remove('tray-active');
    }
  }

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Your food tray is currently empty.</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--primary-amber)">Explore the street menu and add delicious grills!</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${grandTotal}`;

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty} = <strong>₹${item.price * item.qty}</strong></div>
      </div>
      <div class="cart-qty-stepper">
        <button class="cart-qty-btn" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
        <span class="cart-qty-val">${item.qty}</span>
        <button class="cart-qty-btn" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join('');
}

function initCartDrawer() {
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', openCartDrawer);
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCartDrawer();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', triggerWhatsAppOrder);
  }
}

function initFloatingTrayBar() {
  const openBtn = document.getElementById('btn-tray-bar-open');
  if (openBtn) {
    openBtn.addEventListener('click', openCartDrawer);
  }
}

function openCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (backdrop) backdrop.classList.add('open');
}

function closeCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}

function triggerWhatsAppOrder() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packagingFee = 20;
  const grandTotal = subtotal + packagingFee;

  let msg = `🔥 *STREET KITCHEN - NEW ORDER REQUEST* 🔥\n\n`;
  msg += `📍 *Order Items:*\n`;
  cart.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} (x${item.qty}) - ₹${item.price * item.qty}\n`;
  });
  msg += `\n📦 Packaging & Safety: ₹${packagingFee}\n`;
  msg += `💰 *Grand Total: ₹${grandTotal}*\n\n`;
  msg += `🏠 *Delivery / Dine-in / Takeaway:*\n`;
  msg += `Name:\nPhone:\nDelivery Address:\nSpecial Instructions: (e.g. Extra spicy, less oil)\n\n`;
  msg += `_Sent via Street Kitchen 3D Web App_`;

  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encoded}`;
  window.open(waUrl, '_blank');
}

/* ==========================================================================
   5. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2400);
}

/* ==========================================================================
   6. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. TABLE RESERVATION MODAL
   ========================================================================== */
function initReservationModal() {
  const modalBackdrop = document.getElementById('reservation-modal-backdrop');
  const openBtns = document.querySelectorAll('.open-reservation-btn');
  const closeBtn = document.getElementById('reservation-close-btn');
  const resForm = document.getElementById('reservation-form');

  openBtns.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalBackdrop) modalBackdrop.classList.add('open');
    });
  });

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }

  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const phone = document.getElementById('res-phone').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const guests = document.getElementById('res-guests').value;
      const notes = document.getElementById('res-notes').value || 'None';

      let msg = `🍷 *STREET KITCHEN - TABLE RESERVATION* 🍷\n\n`;
      msg += `👤 *Guest Name:* ${name}\n`;
      msg += `📞 *Phone:* ${phone}\n`;
      msg += `📅 *Date:* ${date}\n`;
      msg += `⏰ *Time:* ${time}\n`;
      msg += `👥 *Number of Guests:* ${guests} Persons\n`;
      msg += `📝 *Special Requests:* ${notes}\n\n`;
      msg += `_Please confirm my table reservation._`;

      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encoded}`, '_blank');
      modalBackdrop.classList.remove('open');
    });
  }
}

/* ==========================================================================
   8. LEAFLET DARK MAP (KOLATHUR, CHENNAI)
   ========================================================================== */
function initLeafletMap() {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement || typeof L === 'undefined') return;

  const coords = RESTAURANT_INFO.coordinates;

  const map = L.map('leaflet-map', {
    center: coords,
    zoom: 16,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const customIcon = L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="street-kitchen-radar-marker">
        <div class="radar-ping"></div>
        <div class="radar-pin-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
  });

  const marker = L.marker(coords, { icon: customIcon }).addTo(map);

  marker.bindPopup(`
    <div style="padding: 0.5rem; text-align: center;">
      <h4 style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem; color: #ff5722; margin-bottom: 0.3rem;">Street Kitchen</h4>
      <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 0.8rem;">Kolathur, Chennai • Live Flame Grills & Shawarma</p>
      <a href="${RESTAURANT_INFO.googleMapsUrl}" target="_blank" style="display: inline-block; background: #ff5722; color: #000; padding: 0.4rem 0.9rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; text-decoration: none;">Get Directions</a>
    </div>
  `).openPopup();
}
