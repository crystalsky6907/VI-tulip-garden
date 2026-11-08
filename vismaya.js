/**
 * =========================================================================
 * 🌷 A FLOWER FOR EVERY LITTLE THING ABOUT YOU — FOR VISMAYA
 * =========================================================================
 * 
 * 💌 PERSONAL MESSAGES CONFIGURATION (MITHUN: EDIT YOUR MESSAGES HERE!)
 * You can edit the title, flower description, or message text below at any time.
 * =========================================================================
 */

const VISMAYA_GARDEN_CONFIG = {
  // Section Headings
  sectionTitle: "A Flower for Every Little Thing About You",
  sectionSubtitle: "Every flower represents a special quality, memory, or reason why you are so important to me, Vismaya.",

  // The 6 Special Flowers & Personal Messages
  flowers: [
    {
      id: "pink",
      number: "01",
      name: "Pink Tulip",
      quality: "Your Beautiful Smile",
      color: "#ff69b4",
      gradient: {
        base: "#800f2f",
        mid: "#c9184a",
        rim: "#ff758f",
        top: "#ffebee"
      },
      glow: "rgba(255, 105, 180, 0.55)",
      // Mithun: Edit your personal message for the Pink Tulip below:
      message: "Your smile is so beautiful that i can see you smiling forever.",
      unlockedHint: "Your smile lights up everything."
    },
    {
      id: "red",
      number: "02",
      name: "Red Tulip",
      quality: "Your Kindness",
      color: "#ff2a55",
      gradient: {
        base: "#590d22",
        mid: "#a4161a",
        rim: "#e5383b",
        top: "#ffccd5"
      },
      glow: "rgba(255, 42, 85, 0.55)",
      // Mithun: Edit your personal message for the Red Tulip below:
      message: "Your kindness makes you more special babe .",
      unlockedHint: "Pure, warm and genuine."
    },
    {
      id: "yellow",
      number: "03",
      name: "Yellow Tulip",
      quality: "The Happiness You Bring",
      color: "#ffb703",
      gradient: {
        base: "#7f4f00",
        mid: "#e88c00",
        rim: "#ffb703",
        top: "#fff9db"
      },
      glow: "rgba(255, 183, 3, 0.55)",
      // Mithun: Edit your personal message for the Yellow Tulip below:
      message: "You bring happiness into little moments without even realizing it and always make me mad in love with you.",
      unlockedHint: "My personal ray of sunshine."
    },
    {
      id: "white",
      number: "04",
      name: "White Tulip",
      quality: "Your Beautiful Heart",
      color: "#f8f9fa",
      gradient: {
        base: "#495057",
        mid: "#adb5bd",
        rim: "#dee2e6",
        top: "#ffffff"
      },
      glow: "rgba(255, 255, 255, 0.55)",
      // Mithun: Edit your personal message for the White Tulip below:
      message: "There is something genuinely beautiful about the person you are.",
      unlockedHint: "Gentle, honest and rare."
    },
    {
      id: "purple",
      number: "05",
      name: "Purple Tulip",
      quality: "Your Uniqueness",
      color: "#b5179e",
      gradient: {
        base: "#240046",
        mid: "#5a189a",
        rim: "#9d4edd",
        top: "#e0aaff"
      },
      glow: "rgba(181, 23, 158, 0.55)",
      // Mithun: Edit your personal message for the Purple Tulip below:
      message: "There is nobody quite like you, Vismaya.",
      unlockedHint: "One of a kind in every way."
    },
    {
      id: "orange",
      number: "06",
      name: "Orange Tulip",
      quality: "The Special Person You Are",
      color: "#fb8500",
      gradient: {
        base: "#6a040f",
        mid: "#d00000",
        rim: "#fb8500",
        top: "#ffedd5"
      },
      glow: "rgba(251, 133, 0, 0.55)",
      // Mithun: Edit your personal message for the Orange Tulip below:
      message: "You make this little garden more beautiful just by being in it.",
      unlockedHint: "Always in my heart."
    }
  ],

  // Special Surprise Message after all 6 flowers are bloomed:
  surprise: {
    badge: "Special Surprise Unlocked ❤️",
    title: "A Garden Dedicated To You",
    subtitle: "For Vismaya",
    message: "Six flowers, six little reasons, and countless more that words could never explain. This garden is yours, Vismaya. ❤️",
    footerText: "With all my love, forever."
  }
};

// =========================================================================
// 🌸 VISMAYA GARDEN CONTROLLER
// =========================================================================
class VismayaGarden {
  constructor() {
    this.unlockedFlowers = new Set();
    this.hasSurpriseTriggered = false;
    this.init();
  }

  init() {
    this.renderGardenCards();
    this.setupModals();
    this.setupPetalsCanvas();
    this.setupScrollNavigation();
    this.updateProgress();
  }

  // Generate SVG tulip artwork for each card
  createTulipSVG(flower, isBloomed = false) {
    const g = flower.gradient;
    const flare = isBloomed ? 18 : 6;
    const budHeight = isBloomed ? 62 : 54;
    const budWidth = isBloomed ? 46 : 32;

    return `
      <svg class="tulip-svg ${isBloomed ? 'is-bloomed' : ''}" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-stem-${flower.id}" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0f3813" />
            <stop offset="60%" stop-color="#237a2d" />
            <stop offset="100%" stop-color="#4ad45c" />
          </linearGradient>

          <linearGradient id="grad-petal-${flower.id}" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="${g.base}" />
            <stop offset="35%" stop-color="${g.mid}" />
            <stop offset="75%" stop-color="${g.rim}" />
            <stop offset="100%" stop-color="${g.top}" />
          </linearGradient>

          <filter id="glow-${flower.id}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Curved stem -->
        <path d="M 50 125 Q 52 90 50 55" stroke="url(#grad-stem-${flower.id})" stroke-width="4.2" stroke-linecap="round" fill="none" />

        <!-- Left Leaf -->
        <path d="M 50 100 Q 32 85 24 60 Q 38 68 50 82" fill="#237a2d" opacity="0.9" />

        <!-- Right Leaf -->
        <path d="M 50 88 Q 68 76 76 52 Q 62 60 50 72" fill="#2e9e3b" opacity="0.9" />

        <!-- Calyx -->
        <ellipse cx="50" cy="55" rx="5.5" ry="3.5" fill="#1b5e20" />

        <!-- Blooming Tulip Blossom Group -->
        <g class="flower-head-group" filter="url(#glow-${flower.id})">
          <!-- Back Inner Petal -->
          <path d="M 42 53 Q 36 28 50 18 Q 64 28 58 53 Z" fill="${g.base}" opacity="0.85" />

          <!-- Left Petal -->
          <path class="petal-left" d="M 50 54 Q 30 42 34 24 Q 48 20 48 48 Z" fill="url(#grad-petal-${flower.id})" />

          <!-- Right Petal -->
          <path class="petal-right" d="M 50 54 Q 70 42 66 24 Q 52 20 52 48 Z" fill="url(#grad-petal-${flower.id})" />

          <!-- Front Center Petal -->
          <path class="petal-center" d="M 50 55 C 36 45 38 25 50 20 C 62 25 64 45 50 55 Z" fill="url(#grad-petal-${flower.id})" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
        </g>
      </svg>
    `;
  }

  // Render the 6 interactive cards
  renderGardenCards() {
    const grid = document.getElementById("vismayaGrid");
    if (!grid) return;

    grid.innerHTML = "";
    VISMAYA_GARDEN_CONFIG.flowers.forEach((flower) => {
      const card = document.createElement("div");
      card.className = "flower-card";
      card.id = `flower-card-${flower.id}`;
      card.style.setProperty("--flower-accent", flower.color);
      card.style.setProperty("--flower-glow", flower.glow);

      card.innerHTML = `
        <div class="card-glow-bg"></div>
        <div class="card-header">
          <span class="card-num">${flower.number}</span>
          <span class="card-name">${flower.name}</span>
        </div>
        
        <div class="card-visual-wrapper">
          <div class="card-visual" id="svg-wrap-${flower.id}">
            ${this.createTulipSVG(flower, false)}
          </div>
          <div class="card-aura"></div>
        </div>

        <div class="card-content">
          <h3 class="card-quality">${flower.quality}</h3>
          <div class="card-action">
            <span class="action-btn" id="btn-status-${flower.id}">
              <span class="btn-sparkle">✨</span>
              <span class="btn-label">Tap to Bloom</span>
            </span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => this.handleCardClick(flower));
      grid.appendChild(card);
    });
  }

  handleCardClick(flower) {
    const isFirstTime = !this.unlockedFlowers.has(flower.id);
    this.unlockedFlowers.add(flower.id);

    // Update Card visual to bloomed state
    const card = document.getElementById(`flower-card-${flower.id}`);
    if (card) {
      card.classList.add("is-opened");
      const wrap = document.getElementById(`svg-wrap-${flower.id}`);
      if (wrap) {
        wrap.innerHTML = this.createTulipSVG(flower, true);
      }
      const btn = document.getElementById(`btn-status-${flower.id}`);
      if (btn) {
        btn.classList.add("is-bloomed-btn");
        btn.querySelector(".btn-label").textContent = "Bloomed ❤️";
      }
    }

    // Play chime sound
    if (window.soundSynth) {
      const idx = VISMAYA_GARDEN_CONFIG.flowers.findIndex(f => f.id === flower.id);
      window.soundSynth.playBloomNote(idx + 1);
    }

    this.updateProgress();

    // Open the personal message modal
    this.openMessageModal(flower, isFirstTime);
  }

  updateProgress() {
    const total = VISMAYA_GARDEN_CONFIG.flowers.length;
    const current = this.unlockedFlowers.size;
    const counter = document.getElementById("vismayaProgressCount");
    const bar = document.getElementById("vismayaProgressBar");

    if (counter) {
      counter.textContent = `${current} of ${total} Flowers Bloomed`;
    }
    if (bar) {
      const percent = (current / total) * 100;
      bar.style.width = `${percent}%`;
    }

    // Update pill in toolbar
    const toolbarBadge = document.getElementById("vismayaToolbarBadge");
    if (toolbarBadge) {
      toolbarBadge.textContent = `${current}/6 🌷`;
    }
  }

  setupModals() {
    // Single Flower Modal Elements
    this.flowerModal = document.getElementById("flowerModal");
    this.modalCloseBtn = document.getElementById("modalCloseBtn");
    this.modalBackdrop = document.getElementById("flowerModalBackdrop");

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.closeMessageModal());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener("click", () => this.closeMessageModal());
    }

    // Surprise Modal Elements
    this.surpriseModal = document.getElementById("surpriseModal");
    this.surpriseCloseBtn = document.getElementById("surpriseCloseBtn");
    this.surpriseBackdrop = document.getElementById("surpriseModalBackdrop");
    this.replaySurpriseBtn = document.getElementById("replaySurpriseBtn");

    if (this.surpriseCloseBtn) {
      this.surpriseCloseBtn.addEventListener("click", () => this.closeSurpriseModal());
    }
    if (this.surpriseBackdrop) {
      this.surpriseBackdrop.addEventListener("click", () => this.closeSurpriseModal());
    }
    if (this.replaySurpriseBtn) {
      this.replaySurpriseBtn.addEventListener("click", () => this.showSurpriseModal());
    }

    // ESC key closes modals
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMessageModal();
        this.closeSurpriseModal();
      }
    });
  }

  openMessageModal(flower, isFirstTime) {
    if (!this.flowerModal) return;

    // Populate modal content
    document.getElementById("modalFlowerTag").textContent = `${flower.number} • ${flower.name}`;
    document.getElementById("modalQualityTitle").textContent = flower.quality;
    document.getElementById("modalMessageBody").textContent = flower.message;
    document.getElementById("modalIconWrap").innerHTML = this.createTulipSVG(flower, true);

    // Apply color accents
    this.flowerModal.style.setProperty("--flower-accent", flower.color);
    this.flowerModal.style.setProperty("--flower-glow", flower.glow);

    // Show modal with animation
    this.flowerModal.classList.remove("hidden");
    requestAnimationFrame(() => {
      this.flowerModal.classList.add("active");
    });

    // Check if this action unlocked all 6 flowers!
    if (this.unlockedFlowers.size === VISMAYA_GARDEN_CONFIG.flowers.length && !this.hasSurpriseTriggered) {
      this.hasSurpriseTriggered = true;
      // Trigger surprise celebration right after closing this modal
      this.pendingSurprise = true;
    }
  }

  closeMessageModal() {
    if (!this.flowerModal) return;
    this.flowerModal.classList.remove("active");
    setTimeout(() => {
      this.flowerModal.classList.add("hidden");
      if (this.pendingSurprise) {
        this.pendingSurprise = false;
        setTimeout(() => {
          this.showSurpriseModal();
        }, 350);
      }
    }, 350);
  }

  showSurpriseModal() {
    if (!this.surpriseModal) return;

    // Play triumphant melody
    if (window.soundSynth) {
      [2, 4, 6, 8].forEach((note, i) => {
        setTimeout(() => {
          window.soundSynth.playBloomNote(note);
        }, i * 160);
      });
    }

    // Burst celebration petals
    if (this.petalEmitter) {
      this.petalEmitter.burstCelebration();
    }

    // Display surprise modal
    this.surpriseModal.classList.remove("hidden");
    requestAnimationFrame(() => {
      this.surpriseModal.classList.add("active");
    });
  }

  closeSurpriseModal() {
    if (!this.surpriseModal) return;
    this.surpriseModal.classList.remove("active");
    setTimeout(() => {
      this.surpriseModal.classList.add("hidden");
    }, 350);
  }

  setupScrollNavigation() {
    const toVismayaBtn = document.getElementById("toVismayaBtn");
    const heroScrollDown = document.getElementById("heroScrollDown");
    const toGardenBtn = document.getElementById("toGardenBtn");
    const targetSection = document.getElementById("vismayaSection");

    const scrollToVismaya = (e) => {
      if (e) e.preventDefault();
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (toVismayaBtn) toVismayaBtn.addEventListener("click", scrollToVismaya);
    if (heroScrollDown) heroScrollDown.addEventListener("click", scrollToVismaya);

    if (toGardenBtn) {
      toGardenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  setupPetalsCanvas() {
    const canvas = document.getElementById("vismayaPetalsCanvas");
    if (!canvas) return;
    this.petalEmitter = new FloatingPetalsEngine(canvas);
  }
}

// =========================================================================
// 🍃 FLOATING PETALS & SPARKLES ENGINE
// =========================================================================
class FloatingPetalsEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.petals = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.colors = ["#ff69b4", "#ff2a55", "#ffb703", "#ffffff", "#b5179e", "#fb8500"];

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.seedPetals();
    requestAnimationFrame((t) => this.render(t));
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.offsetWidth : window.innerWidth;
    this.height = parent ? parent.offsetHeight : window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
  }

  seedPetals() {
    const count = Math.min(45, Math.floor(this.width / 26));
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal(Math.random() * this.height));
    }
  }

  createPetal(startY = -20) {
    return {
      x: Math.random() * this.width,
      y: startY,
      size: Math.random() * 8 + 6,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.9 + 0.4,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI * 2,
      vFlip: Math.random() * 0.02 + 0.01,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: Math.random() * 0.5 + 0.35
    };
  }

  burstCelebration() {
    for (let i = 0; i < 90; i++) {
      const p = this.createPetal(this.height * 0.5 + (Math.random() - 0.5) * 120);
      p.x = this.width * 0.5 + (Math.random() - 0.5) * 200;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1.5;
      p.size = Math.random() * 10 + 7;
      p.alpha = 0.9;
      this.petals.push(p);
    }
  }

  render(time) {
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.x += p.vx + Math.sin(p.y * 0.015) * 0.4;
      p.y += p.vy;
      p.rot += p.vRot;
      p.flip += p.vFlip;

      // Wrap or recycle
      if (p.y > this.height + 25 || p.x < -30 || p.x > this.width + 30) {
        this.petals[i] = this.createPetal(-20);
        continue;
      }

      // Draw graceful curved petal
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);
      this.ctx.scale(1, Math.cos(p.flip));
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 6;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.7, p.size * 0.7, p.size * 0.7, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.7, -p.size * 0.7, 0, -p.size);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }

    requestAnimationFrame((t) => this.render(t));
  }
}

// Global hook up
window.addEventListener("DOMContentLoaded", () => {
  window.vismayaGarden = new VismayaGarden();
});

