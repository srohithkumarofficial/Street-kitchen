// Street Kitchen - Enhanced Application Engine with Mobile Drawer & WhatsApp Sync

// Global State
let threeSceneInstance = null;
let cart = [];
let currentCategory = 'all';
let revealObserver = null;

document.addEventListener('DOMContentLoaded', () => {
  initIntroLogoReveal();
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
  initPageMotion();
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

  grid.innerHTML = items.map((item, index) => `
    <article class="dish-card-wrapper scroll-reveal" data-id="${item.id}" style="--reveal-delay: ${Math.min(index * 45, 360)}ms">
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

  observeRevealElements(grid.querySelectorAll('.scroll-reveal'));
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
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  observeRevealElements(elements);
}

function observeRevealElements(elements) {
  if (!revealObserver) return;
  elements.forEach((el, index) => {
    if (!el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', `${Math.min(index * 55, 420)}ms`);
    }
    revealObserver.observe(el);
  });
}

function initPageMotion() {
  document.querySelectorAll('.hero-content > *, .hero-3d-stage, .footer-grid > *, .loc-meta-item').forEach((el, index) => {
    el.classList.add('scroll-reveal');
    el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
  });
  observeRevealElements(document.querySelectorAll('.hero-content > *, .hero-3d-stage, .footer-grid > *, .loc-meta-item'));
}

/* ==========================================================================
   0. CINEMATIC PARTICLE LOGO REVEAL
   ========================================================================== */
function initIntroLogoReveal() {
  const overlay = document.getElementById('intro-logo-reveal');
  const mount = document.getElementById('intro-canvas-wrap');
  const finalLogo = document.getElementById('intro-logo-final');

  if (!overlay || !mount || typeof THREE === 'undefined') {
    document.body.classList.remove('intro-active');
    if (overlay) overlay.remove();
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    overlay.classList.add('intro-skip');
    document.body.classList.remove('intro-active');
    setTimeout(() => overlay.remove(), 450);
    return;
  }

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  const clock = new THREE.Clock();
  const logoImage = new Image();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  mount.appendChild(renderer.domElement);

  camera.position.set(0, 0.04, 8.9);
  scene.add(new THREE.AmbientLight(0xffffff, 0.78));

  const warmLight = new THREE.PointLight(0xffc46b, 1.7, 16);
  warmLight.position.set(2.4, 1.8, 4);
  scene.add(warmLight);

  const rimLight = new THREE.PointLight(0xe63946, 1.2, 14);
  rimLight.position.set(-3, -1.2, 3.2);
  scene.add(rimLight);

  logoImage.onload = () => {
    const particleData = sampleLogoParticles(logoImage);
    const geometry = new THREE.BufferGeometry();
    const startPositions = new Float32Array(particleData.count * 3);
    const targetPositions = new Float32Array(particleData.count * 3);
    const currentPositions = new Float32Array(particleData.count * 3);
    const colors = new Float32Array(particleData.count * 3);
    const baseColors = new Float32Array(particleData.count * 3);

    for (let i = 0; i < particleData.count; i++) {
      const spread = window.innerWidth < 720 ? 5.4 : 7.4;
      startPositions[i * 3] = (Math.random() - 0.5) * spread;
      startPositions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.2;
      startPositions[i * 3 + 2] = (Math.random() - 0.5) * 7.8 - 1.4;

      targetPositions[i * 3] = particleData.positions[i * 3];
      targetPositions[i * 3 + 1] = particleData.positions[i * 3 + 1];
      targetPositions[i * 3 + 2] = particleData.positions[i * 3 + 2];

      currentPositions.set(startPositions.slice(i * 3, i * 3 + 3), i * 3);
      baseColors.set(particleData.colors.slice(i * 3, i * 3 + 3), i * 3);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: window.innerWidth < 720 ? 0.042 : 0.034,
      transparent: true,
      opacity: 0.92,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: createParticleTexture()
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.set(0.12, -0.18, 0);
    scene.add(points);

    let frame = 1;
    const totalFrames = 180;
    const finalLogoHoldMs = 1400;

    const finishIntro = () => {
      overlay.classList.add('intro-done');
      document.body.classList.remove('intro-active');
      setTimeout(() => {
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        overlay.remove();
      }, 1900);
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const progress = Math.min(frame / totalFrames, 1);
      const gather = easeInOutCubic(clamp01((progress - 0.42) / 0.36));
      const settle = easeOutCubic(clamp01((progress - 0.72) / 0.14));
      const push = easeInOutCubic(clamp01((progress - 0.80) / 0.18));
      const shimmer = clamp01((progress - 0.90) / 0.10);
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < particleData.count; i++) {
        const i3 = i * 3;
        const earlyVisible = i % 29 === 0 || i % 43 === 0;
        const arrivalDelay = ((i * 17) % 100) / 100 * 0.22;
        const assemble = easeInOutCubic(clamp01((progress - 0.42 - arrivalDelay) / 0.34));
        const particleGlow = Math.max(earlyVisible ? 0.42 : 0, clamp01((progress - 0.28 - arrivalDelay) / 0.42));
        const drift = Math.sin(elapsed * 0.42 + i * 0.21) * (1 - assemble) * 0.12;
        const floatX = Math.sin(elapsed * 0.3 + i * 0.09) * (1 - gather) * 0.05;
        const floatY = Math.cos(elapsed * 0.28 + i * 0.07) * (1 - gather) * 0.045;
        const depthSettle = targetPositions[i3 + 2] + Math.sin(i * 0.13) * 0.08 * (1 - settle);
        positions[i3] = THREE.MathUtils.lerp(startPositions[i3] + drift + floatX, targetPositions[i3], assemble);
        positions[i3 + 1] = THREE.MathUtils.lerp(startPositions[i3 + 1] - drift + floatY, targetPositions[i3 + 1], assemble);
        positions[i3 + 2] = THREE.MathUtils.lerp(startPositions[i3 + 2], depthSettle, assemble);

        colors[i3] = baseColors[i3] * particleGlow;
        colors[i3 + 1] = baseColors[i3 + 1] * particleGlow;
        colors[i3 + 2] = baseColors[i3 + 2] * particleGlow;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      points.rotation.y = THREE.MathUtils.lerp(-0.24, 0.035, gather) + Math.sin(elapsed * 0.22) * 0.018;
      points.rotation.x = THREE.MathUtils.lerp(0.16, 0, gather);
      points.scale.setScalar(THREE.MathUtils.lerp(0.9, 1.12, push));
      material.opacity = THREE.MathUtils.lerp(0.92, 0.2, shimmer);
      camera.position.z = THREE.MathUtils.lerp(8.9, 7.55, easeInOutCubic(clamp01(progress / 0.72)));
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.95, push);
      camera.position.x = Math.sin(elapsed * 0.18) * 0.16 * (1 - push);
      camera.position.y = 0.04 + Math.cos(elapsed * 0.16) * 0.055 * (1 - push);
      camera.lookAt(0, 0.02, 0);

      if (progress > 0.78) finalLogo.classList.add('visible');
      if (progress > 0.91) finalLogo.classList.add('edge-lit');

      renderer.render(scene, camera);

      if (frame < totalFrames) {
        frame += 1;
        requestAnimationFrame(animate);
      } else {
        overlay.classList.add('intro-hold');
        setTimeout(finishIntro, finalLogoHoldMs);
      }
    };

    animate();
  };

  logoImage.onerror = () => {
    document.body.classList.remove('intro-active');
    overlay.classList.add('intro-done');
    setTimeout(() => overlay.remove(), 650);
  };

  logoImage.src = 'logo.png';

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
}

function sampleLogoParticles(image) {
  const size = 180;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const isMobile = window.innerWidth < 720;
  const maxParticles = isMobile ? 820 : 1280;
  const scale = isMobile ? 3.7 : 4.35;

  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(image, 0, 0, size, size);

  const pixels = ctx.getImageData(0, 0, size, size).data;
  const candidates = [];

  for (let y = 4; y < size - 4; y += 3) {
    for (let x = 4; x < size - 4; x += 3) {
      const idx = (y * size + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];
      const brightness = (r + g + b) / 3;
      const redSignal = r > 95 && r > g * 1.16 && r > b * 1.16;
      const lightSignal = brightness > 88;

      if (a > 40 && (redSignal || lightSignal)) {
        candidates.push({ x, y, r, g, b, redSignal });
      }
    }
  }

  candidates.sort(() => Math.random() - 0.5);
  const selected = candidates.slice(0, maxParticles);
  const positions = new Float32Array(selected.length * 3);
  const colors = new Float32Array(selected.length * 3);

  selected.forEach((point, i) => {
    const i3 = i * 3;
    positions[i3] = ((point.x / size) - 0.5) * scale;
    positions[i3 + 1] = (0.5 - (point.y / size)) * scale;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.42;

    if (point.redSignal) {
      colors[i3] = 1;
      colors[i3 + 1] = 0.16 + Math.random() * 0.08;
      colors[i3 + 2] = 0.08;
    } else {
      colors[i3] = 1;
      colors[i3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i3 + 2] = 0.74 + Math.random() * 0.18;
    }
  });

  return { count: selected.length, positions, colors };
}

function createParticleTexture() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 64;
  canvas.height = 64;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
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
