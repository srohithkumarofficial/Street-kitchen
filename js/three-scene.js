// Street Kitchen - Clean 3D Interactive Hero Engine (No weird wire rings or flat distorted discs)
class Street3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Mouse / Touch Parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.currentModelIndex = 0;
    this.models = [];
    this.particles = null;

    this.textureLoader = new THREE.TextureLoader();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera: placed directly in perfect viewing position (no intro delay)
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0.2, 5.8);
    this.camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting
    this.setupLights();

    // 5. Clean, Realistic 3D Food Showcase Stages
    this.buildFoodShowcases();

    // 6. Realistic Sizzling Embers
    this.createEmberParticles();

    // 7. Events
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });

    // 8. Start Loop
    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    this.scene.add(ambientLight);

    // Warm Amber Key Light
    const keyLight = new THREE.DirectionalLight(0xff7a00, 2.8);
    keyLight.position.set(4, 5, 4);
    this.scene.add(keyLight);

    // Crimson Glow Rim
    const rimLight = new THREE.PointLight(0xe63946, 2.2, 15);
    rimLight.position.set(-3.5, -1, 3);
    this.scene.add(rimLight);

    // Soft Gold Overhead
    const goldLight = new THREE.PointLight(0xffb703, 2.5, 12);
    goldLight.position.set(0, 4, 3);
    this.scene.add(goldLight);
  }

  buildFoodShowcases() {
    this.showcaseGroup = new THREE.Group();
    this.scene.add(this.showcaseGroup);

    // Dish 1: Smoked Charcoal Chicken Shawarma
    const dish1 = this.createRealisticFoodCard(
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
      'Smoked Charcoal Shawarma',
      '🔥 500°F Charcoal Roasted • Garlic Toum',
      0xff5722
    );
    dish1.visible = true;
    this.showcaseGroup.add(dish1);
    this.models.push(dish1);

    // Dish 2: Midnight Beast Smash Burger
    const dish2 = this.createRealisticFoodCard(
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      'Midnight Beast Smash Burger',
      '🍔 Double Smashed Patties • Aged Cheddar',
      0xffb703
    );
    dish2.visible = false;
    this.showcaseGroup.add(dish2);
    this.models.push(dish2);

    // Dish 3: Flame Wok Hakka Noodles
    const dish3 = this.createRealisticFoodCard(
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
      'Szechuan Wok Noodles',
      '🥢 Smoky Wok Hei • Artisan Chili Crisp',
      0xe63946
    );
    dish3.visible = false;
    this.showcaseGroup.add(dish3);
    this.models.push(dish3);
  }

  createRealisticFoodCard(imageUrl, title, subtitle, accentColor) {
    const cardGroup = new THREE.Group();

    // 1. Soft Shadow Backdrop Base
    const shadowGeo = new THREE.PlaneGeometry(3.6, 0.9);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.set(0, -1.85, -0.2);
    shadow.rotation.x = -Math.PI / 2.5;
    cardGroup.add(shadow);

    // 2. High-End Glassmorphic 3D Card Frame
    const frameGeo = new THREE.PlaneGeometry(3.6, 3.8);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x121218,
      metalness: 0.4,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.z = -0.05;
    cardGroup.add(frame);

    // Accent Glowing Border Lip
    const borderGeo = new THREE.PlaneGeometry(3.66, 3.86);
    const borderMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.45
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.08;
    cardGroup.add(border);

    // 3. High-Resolution Real Dish Image
    const texture = this.textureLoader.load(imageUrl);
    texture.generateMipmaps = true;

    const imgGeo = new THREE.PlaneGeometry(3.3, 2.3);
    const imgMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.05
    });
    const imgMesh = new THREE.Mesh(imgGeo, imgMat);
    imgMesh.position.set(0, 0.5, 0.05);
    cardGroup.add(imgMesh);

    // 4. 3D Canvas Typography Details
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 680;
    textCanvas.height = 200;
    const ctx = textCanvas.getContext('2d');

    // Title
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(title, 340, 60);

    // Subtitle / Ingredients
    ctx.font = '500 24px Outfit, sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.fillText(subtitle, 340, 110);

    // Rating & Badge
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('★ 4.9 (1.2K+ Reviews) • FRESHLY GRILLED', 340, 155);

    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textGeo = new THREE.PlaneGeometry(3.3, 1.0);
    const textMat = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(0, -1.15, 0.08);
    cardGroup.add(textMesh);

    return cardGroup;
  }

  createEmberParticles() {
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color(0xff5722);
    const colorB = new THREE.Color(0xffb703);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      scales[i] = Math.random() * 2.0 + 0.6;

      const c = Math.random() > 0.4 ? colorA : colorB;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 120, 0, 0.85)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.18,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  switchModel(index) {
    if (index === this.currentModelIndex || index < 0 || index >= this.models.length) return;

    const prev = this.models[this.currentModelIndex];
    const next = this.models[index];
    this.currentModelIndex = index;

    prev.visible = false;
    next.visible = true;
    next.scale.set(0.6, 0.6, 0.6);
    next.rotation.y = -0.4;

    let progress = 0;
    const anim = () => {
      progress += 0.1;
      const s = THREE.MathUtils.lerp(0.6, 1.0, Math.min(progress, 1));
      next.scale.set(s, s, s);
      next.rotation.y = THREE.MathUtils.lerp(-0.4, 0, Math.min(progress, 1));
      if (progress < 1) requestAnimationFrame(anim);
    };
    anim();
  }

  onMouseMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.targetX = x * 0.45;
    this.mouse.targetY = y * 0.45;
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = -(touch.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = x * 0.3;
      this.mouse.targetY = y * 0.3;
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Smooth float & 3D card tilt
    const activeCard = this.models[this.currentModelIndex];
    if (activeCard) {
      activeCard.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      activeCard.rotation.y = this.mouse.x * 0.4 + Math.sin(elapsedTime * 0.6) * 0.04;
      activeCard.rotation.x = -this.mouse.y * 0.3;
    }

    // Particle rise
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += 0.02 + Math.sin(elapsedTime + i) * 0.004;
        pos[i] += Math.sin(elapsedTime * 0.4 + i) * 0.003;

        if (pos[i + 1] > 4.5) {
          pos[i + 1] = -4.5;
          pos[i] = (Math.random() - 0.5) * 12;
          pos[i + 2] = (Math.random() - 0.5) * 6;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
