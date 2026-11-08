/**
 * Blooming Tulips - Interactive Canvas Garden
 * Inspired by the organic blooming tulip animation in the reference video.
 */

// ==========================================
// 1. Color Palettes Engine
// ==========================================
const TULIP_PALETTES = [
  {
    name: "Crimson Velvet", // Reference video palette
    outerTop: "#ffebee",
    outerRim: "#ff4d6d",
    outerMid: "#c9184a",
    outerBase: "#800f2f",
    innerDeep: "#590d22",
    glow: "rgba(255, 77, 109, 0.45)",
    sparkle: ["#ffd166", "#ff758f", "#ffffff", "#ff4d6d"]
  },
  {
    name: "Sunset Fire",
    outerTop: "#fff8e1",
    outerRim: "#ff9100",
    outerMid: "#ff3d00",
    outerBase: "#bf360c",
    innerDeep: "#7f0000",
    glow: "rgba(255, 109, 0, 0.45)",
    sparkle: ["#ffe57f", "#ff9100", "#ffffff", "#ff6e40"]
  },
  {
    name: "Royal Amethyst",
    outerTop: "#f3e5f5",
    outerRim: "#c77dff",
    outerMid: "#9d4edd",
    outerBase: "#5a189a",
    innerDeep: "#240046",
    glow: "rgba(199, 125, 255, 0.45)",
    sparkle: ["#e0aaff", "#c77dff", "#ffffff", "#7209b7"]
  },
  {
    name: "Neon Magenta",
    outerTop: "#fce4ec",
    outerRim: "#ff4081",
    outerMid: "#f50057",
    outerBase: "#c51162",
    innerDeep: "#500724",
    glow: "rgba(255, 64, 129, 0.48)",
    sparkle: ["#ff80ab", "#ff4081", "#ffffff", "#f50057"]
  },
  {
    name: "Celestial Cyan",
    outerTop: "#e0f7fa",
    outerRim: "#00e5ff",
    outerMid: "#00b0ff",
    outerBase: "#0077b6",
    innerDeep: "#03045e",
    glow: "rgba(0, 229, 255, 0.45)",
    sparkle: ["#a7ffeb", "#00e5ff", "#ffffff", "#48cae4"]
  },
  {
    name: "Golden Saffron",
    outerTop: "#fffde7",
    outerRim: "#ffeb3b",
    outerMid: "#ffc107",
    outerBase: "#ff8f00",
    innerDeep: "#e65100",
    glow: "rgba(255, 235, 59, 0.45)",
    sparkle: ["#fff9c4", "#ffeb3b", "#ffffff", "#ffa000"]
  },
  {
    name: "Pearl Blush",
    outerTop: "#ffffff",
    outerRim: "#f8bbd0",
    outerMid: "#f48fb1",
    outerBase: "#ec407a",
    innerDeep: "#880e4f",
    glow: "rgba(255, 182, 193, 0.4)",
    sparkle: ["#ffffff", "#ffcdd2", "#ffd700", "#f8bbd0"]
  },
  {
    name: "Emerald Aurora",
    outerTop: "#e8f5e9",
    outerRim: "#69f0ae",
    outerMid: "#00e676",
    outerBase: "#00897b",
    innerDeep: "#004d40",
    glow: "rgba(105, 240, 174, 0.45)",
    sparkle: ["#b9f6ca", "#69f0ae", "#ffffff", "#00bfa5"]
  },
  {
    name: "Twilight Orchid",
    outerTop: "#ede7f6",
    outerRim: "#b388ff",
    outerMid: "#7c4dff",
    outerBase: "#651fff",
    innerDeep: "#311b92",
    glow: "rgba(179, 136, 255, 0.45)",
    sparkle: ["#d1c4e9", "#b388ff", "#ffffff", "#7c4dff"]
  },
  {
    name: "Coral Flame",
    outerTop: "#fff3e0",
    outerRim: "#ff6e40",
    outerMid: "#ff3d00",
    outerBase: "#d84315",
    innerDeep: "#4e1402",
    glow: "rgba(255, 110, 64, 0.45)",
    sparkle: ["#ffe0b2", "#ff6e40", "#ffffff", "#ffd54f"]
  }
];

let lastPaletteIdx = -1;
function getRandomPalette() {
  let idx;
  do {
    idx = Math.floor(Math.random() * TULIP_PALETTES.length);
  } while (idx === lastPaletteIdx && TULIP_PALETTES.length > 1);
  lastPaletteIdx = idx;
  return TULIP_PALETTES[idx];
}

// Generate sister color for flanking blossoms in the bouquet
function createSisterPalette(palette, offset = 1) {
  const nextIdx = (lastPaletteIdx + offset) % TULIP_PALETTES.length;
  const companion = TULIP_PALETTES[nextIdx];
  return {
    ...companion,
    sparkle: [...palette.sparkle]
  };
}

// ==========================================
// 2. Web Audio Sound Synthesizer
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
    // Harmonic Pentatonic scale frequencies in Hz
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playBloomNote(pitchOffset = 0) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseIdx = Math.min(this.scale.length - 1, Math.max(0, 3 + pitchOffset));
      const freq = this.scale[baseIdx];

      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(freq * 2.0, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.065, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 1.8);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 1.85);
      oscHarmonic.stop(now + 1.85);
    } catch (e) {
      // Audio safety
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

const soundSynth = new SoundSynth();
window.soundSynth = soundSynth;

// ==========================================
// 3. Easing Functions
// ==========================================
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function easeOutBack(t) {
  const c1 = 1.45;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ==========================================
// 4. Starry Background & Particles
// ==========================================
class Starfield {
  constructor(width, height) {
    this.stars = [];
    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    const count = Math.min(90, Math.floor((width * height) / 16000));
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.5,
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.45 + 0.15,
        isCross: Math.random() > 0.55
      });
    }
  }

  draw(ctx, time) {
    ctx.save();
    for (const star of this.stars) {
      const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3;
      if (alpha <= 0.05) continue;

      ctx.fillStyle = `rgba(220, 240, 255, ${Math.min(1, alpha)})`;
      if (star.isCross) {
        ctx.beginPath();
        const r = star.r * 1.8;
        ctx.moveTo(star.x, star.y - r);
        ctx.lineTo(star.x + r * 0.45, star.y);
        ctx.lineTo(star.x, star.y + r);
        ctx.lineTo(star.x - r * 0.45, star.y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

class PollenSparkle {
  constructor(x, y, paletteColors) {
    this.x = x + (Math.random() - 0.5) * 26;
    this.y = y + (Math.random() - 0.5) * 12;
    this.vx = (Math.random() - 0.5) * 0.9;
    this.vy = -(Math.random() * 1.25 + 0.65);
    this.size = Math.random() * 2.8 + 1.2;
    this.maxLife = Math.random() * 110 + 75;
    this.life = this.maxLife;
    this.color = paletteColors[Math.floor(Math.random() * paletteColors.length)];
    this.twinkleRate = Math.random() * 0.2 + 0.08;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx + Math.sin(this.life * 0.05) * 0.35;
    this.y += this.vy;
    this.vx *= 0.99;
    this.vy *= 0.992;
    this.life--;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const progress = this.life / this.maxLife;
    const twinkle = 0.5 + 0.5 * Math.sin(this.life * this.twinkleRate + this.twinklePhase);
    const alpha = Math.sin(progress * Math.PI) * twinkle;
    if (alpha <= 0.02) return;

    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = this.color;

    // Glowing diamond sparkle
    const r = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - r);
    ctx.lineTo(this.x + r * 0.5, this.y);
    ctx.lineTo(this.x, this.y + r);
    ctx.lineTo(this.x - r * 0.5, this.y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

class ClickRipple {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 4;
    this.maxRadius = 75;
    this.life = 45;
    this.maxLife = 45;
  }

  update() {
    this.radius += (this.maxRadius - this.radius) * 0.08;
    this.life--;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = (this.life / this.maxLife) * 0.65;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

// ==========================================
// 5. Botanical Foliage (Leaves & Grass)
// ==========================================
class BotanicalLeaf {
  constructor(options) {
    this.side = options.side || 1; // -1 = left, 1 = right
    this.stemProgress = options.stemProgress;
    this.targetLen = options.targetLen;
    this.targetWidth = options.targetWidth;
    this.angleOffset = options.angleOffset;
    this.curl = options.curl;
    this.growthDelay = options.growthDelay;
    this.growthDuration = options.growthDuration || 80;
    this.isForeground = options.isForeground || false;
    this.age = 0;
  }

  update() {
    this.age++;
  }

  draw(ctx, x, y, stemAngle, wind) {
    if (this.age < this.growthDelay) return;
    const progress = Math.min(1, (this.age - this.growthDelay) / this.growthDuration);
    if (progress <= 0) return;

    const ease = easeOutCubic(progress);
    const len = this.targetLen * ease;
    const width = this.targetWidth * ease;

    const baseAngle = stemAngle + this.angleOffset + wind * 0.18;
    const tipAngle = baseAngle + (this.side * this.curl) + wind * 0.35;

    // Control point and tip coordinates
    const cpDist = len * 0.52;
    const cpX = x + Math.cos(baseAngle) * cpDist;
    const cpY = y + Math.sin(baseAngle) * cpDist;

    const tipX = x + Math.cos(baseAngle * 0.55 + tipAngle * 0.45) * len;
    const tipY = y + Math.sin(baseAngle * 0.55 + tipAngle * 0.45) * len;

    // Perpendicular vector for leaf blade width
    const perp = baseAngle + Math.PI / 2;
    const wX = Math.cos(perp) * (width * 0.5);
    const wY = Math.sin(perp) * (width * 0.5);

    ctx.save();

    // Leaf gradient: shadow green to luminous leaf blade
    const grad = ctx.createLinearGradient(x, y, tipX, tipY);
    if (this.isForeground) {
      grad.addColorStop(0, "#164d1f");
      grad.addColorStop(0.35, "#258434");
      grad.addColorStop(0.75, "#3ec752");
      grad.addColorStop(1, "#66e378");
    } else {
      grad.addColorStop(0, "#0e3314");
      grad.addColorStop(0.4, "#185722");
      grad.addColorStop(0.8, "#288736");
      grad.addColorStop(1, "#44b553");
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(120, 240, 135, 0.4)";
    ctx.lineWidth = 1;

    // Draw realistic tapered tulip leaf blade
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(cpX + wX, cpY + wY, tipX, tipY);
    ctx.quadraticCurveTo(cpX - wX * 0.35, cpY - wY * 0.35, x, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Delicate leaf vein midrib
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(cpX + wX * 0.08, cpY + wY * 0.08, tipX, tipY);
    ctx.strokeStyle = "rgba(195, 255, 185, 0.38)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }
}

class BaseGrassBlade {
  constructor(originX, originY, side, length, angleOffset, delay) {
    this.x = originX;
    this.y = originY;
    this.side = side;
    this.targetLen = length;
    this.angle = (side < 0 ? -1.85 : -1.29) + angleOffset;
    this.delay = delay;
    this.progress = 0;
    this.age = 0;
  }

  update() {
    this.age++;
    if (this.age > this.delay) {
      this.progress = Math.min(1, this.progress + 0.024);
    }
  }

  draw(ctx, wind) {
    if (this.progress <= 0) return;
    const len = this.targetLen * easeOutCubic(this.progress);
    const dynAngle = this.angle + wind * (0.2 + Math.abs(this.side) * 0.1);

    const cpX = this.x + Math.cos(dynAngle) * (len * 0.5) + (this.side * 14);
    const cpY = this.y + Math.sin(dynAngle) * (len * 0.5);

    const tipX = this.x + Math.cos(dynAngle) * len;
    const tipY = this.y + Math.sin(dynAngle) * len;

    ctx.save();
    const grad = ctx.createLinearGradient(this.x, this.y, tipX, tipY);
    grad.addColorStop(0, "#0a260f");
    grad.addColorStop(0.45, "#1f6e2a");
    grad.addColorStop(1, "#4edc5e");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(this.x - 2.2, this.y);
    ctx.quadraticCurveTo(cpX - 1, cpY, tipX, tipY);
    ctx.quadraticCurveTo(cpX + 1, cpY, this.x + 2.2, this.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// ==========================================
// 6. Blooming Tulip Blossom
// ==========================================
class TulipBlossom {
  constructor(options) {
    this.palette = options.palette;
    this.targetHeight = options.height;
    this.targetWidth = options.width;
    this.bloomDelay = options.bloomDelay;
    this.bloomDuration = options.bloomDuration || 75;
    this.pitchOffset = options.pitchOffset || 0;
    this.age = 0;
    this.hasChimed = false;
  }

  update(flowerX, flowerY, particles) {
    this.age++;

    // Trigger sweet chime when bud begins to open
    if (this.age >= this.bloomDelay && !this.hasChimed) {
      this.hasChimed = true;
      soundSynth.playBloomNote(this.pitchOffset);
    }

    // Sparkles float up from inside the flower cup as petals unfurl
    if (this.age >= this.bloomDelay + 15) {
      const bloomRatio = Math.min(1, (this.age - this.bloomDelay) / this.bloomDuration);
      if (Math.random() < 0.32 * bloomRatio) {
        particles.push(new PollenSparkle(flowerX, flowerY - this.targetHeight * 0.55, this.palette.sparkle));
      }
    }
  }

  draw(ctx, x, y, stemAngle, wind) {
    if (this.age < this.bloomDelay) return;
    const rawProgress = Math.min(1, (this.age - this.bloomDelay) / this.bloomDuration);
    if (rawProgress <= 0) return;

    const ease = easeOutBack(rawProgress);
    const H = this.targetHeight * (0.32 + 0.68 * ease);
    const W = this.targetWidth * (0.28 + 0.72 * ease);

    // Dynamic rotation follows stem curvature and gentle breeze
    const rot = stemAngle + Math.PI / 2 + wind * 0.22;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Luminous halo aura around the flower blossom
    if (rawProgress > 0.25) {
      const auraIntensity = Math.min(0.65, (rawProgress - 0.25) * 0.88);
      ctx.save();
      const auraGrad = ctx.createRadialGradient(0, -H * 0.55, H * 0.08, 0, -H * 0.55, H * 1.05);
      auraGrad.addColorStop(0, this.palette.glow);
      auraGrad.addColorStop(0.65, this.palette.glow.replace(/[\d\.]+\)$/, `${auraIntensity * 0.28})`));
      auraGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -H * 0.55, H * 1.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Small green stem receptacle / calyx at base
    ctx.fillStyle = "#19541f";
    ctx.beginPath();
    ctx.ellipse(0, -2, 5 * ease, 4 * ease, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spread factor as side petals blossom outwards
    const flare = Math.min(1, ease) * 0.28;

    // 1. BACK / INNER PETALS (Revealed inside opening cup)
    if (rawProgress > 0.15) {
      const innerGrad = ctx.createLinearGradient(0, 0, 0, -H * 1.05);
      innerGrad.addColorStop(0, this.palette.innerDeep);
      innerGrad.addColorStop(0.55, this.palette.outerBase);
      innerGrad.addColorStop(1, this.palette.outerMid);

      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.moveTo(-W * 0.25, -H * 0.15);
      ctx.quadraticCurveTo(-W * 0.42, -H * 0.78, 0, -H * 1.05);
      ctx.quadraticCurveTo(W * 0.42, -H * 0.78, W * 0.25, -H * 0.15);
      ctx.closePath();
      ctx.fill();

      // Golden stamen filaments with pollen heads inside the opening flower
      if (rawProgress > 0.45) {
        ctx.save();
        ctx.strokeStyle = "#ffd54f";
        ctx.lineWidth = 1.6;
        ctx.shadowColor = "#ffeb3b";
        ctx.shadowBlur = 6;

        for (const sx of [-4.5, 0, 4.5]) {
          ctx.beginPath();
          ctx.moveTo(sx * 0.5, -H * 0.18);
          ctx.lineTo(sx, -H * 0.44);
          ctx.stroke();

          // Golden pollen anther dot
          ctx.fillStyle = "#fff59d";
          ctx.beginPath();
          ctx.arc(sx, -H * 0.46, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 2. OUTER LEFT PETAL
    ctx.save();
    ctx.rotate(-flare);
    const leftGrad = ctx.createLinearGradient(-W * 0.6, 0, 0, -H);
    leftGrad.addColorStop(0, this.palette.outerBase);
    leftGrad.addColorStop(0.4, this.palette.outerMid);
    leftGrad.addColorStop(0.8, this.palette.outerRim);
    leftGrad.addColorStop(1, this.palette.outerTop);

    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-W * 0.68, -H * 0.28, -W * 0.6, -H * 0.82, -W * 0.2, -H * 0.98);
    ctx.quadraticCurveTo(0, -H * 0.88, W * 0.05, -H * 0.45);
    ctx.quadraticCurveTo(0, -H * 0.15, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Delicate rim highlight stroke
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();

    // 3. OUTER RIGHT PETAL
    ctx.save();
    ctx.rotate(flare);
    const rightGrad = ctx.createLinearGradient(W * 0.6, 0, 0, -H);
    rightGrad.addColorStop(0, this.palette.outerBase);
    rightGrad.addColorStop(0.4, this.palette.outerMid);
    rightGrad.addColorStop(0.8, this.palette.outerRim);
    rightGrad.addColorStop(1, this.palette.outerTop);

    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(W * 0.68, -H * 0.28, W * 0.6, -H * 0.82, W * 0.2, -H * 0.98);
    ctx.quadraticCurveTo(0, -H * 0.88, -W * 0.05, -H * 0.45);
    ctx.quadraticCurveTo(0, -H * 0.15, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Delicate rim highlight stroke
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();

    // 4. CENTER FRONT PETAL (Creates the full rounded 3D tulip goblet)
    const centerGrad = ctx.createLinearGradient(0, 0, 0, -H * 0.94);
    centerGrad.addColorStop(0, this.palette.outerBase);
    centerGrad.addColorStop(0.45, this.palette.outerMid);
    centerGrad.addColorStop(0.85, this.palette.outerRim);
    centerGrad.addColorStop(1, this.palette.outerTop);

    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-W * 0.42, -H * 0.25, -W * 0.38, -H * 0.8, 0, -H * 0.95);
    ctx.bezierCurveTo(W * 0.38, -H * 0.8, W * 0.42, -H * 0.25, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Front rim highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }
}

// ==========================================
// 7. Complete Tulip Plant Entity
// ==========================================
class TulipPlant {
  constructor(originX, originY, targetHeight, mainPalette) {
    this.x = originX;
    this.y = originY;
    this.targetHeight = targetHeight;
    this.mainPalette = mainPalette;
    this.leftPalette = createSisterPalette(mainPalette, 1);
    this.rightPalette = createSisterPalette(mainPalette, 2);

    this.age = 0;
    this.stemGrowthDuration = 95;
    this.growthProgress = 0;

    // Organic wind breeze
    this.windPhase = Math.random() * Math.PI * 2;
    this.windSpeed = 0.022 + Math.random() * 0.008;

    // Stems configuration matching the reference video:
    // Tall central stem + 2 graceful flanking branches
    this.stems = [
      // Central stem
      {
        type: "main",
        heightRatio: 1.0,
        curveX: (Math.random() - 0.5) * 14,
        thickness: 5.0,
        flower: new TulipBlossom({
          palette: this.mainPalette,
          height: 66,
          width: 52,
          bloomDelay: 68,
          bloomDuration: 75,
          pitchOffset: 2
        })
      },
      // Left auxiliary stem
      {
        type: "branch",
        side: -1,
        branchRatio: 0.38,
        heightRatio: 0.80,
        curveX: -56 - Math.random() * 18,
        thickness: 4.0,
        flower: new TulipBlossom({
          palette: this.leftPalette,
          height: 54,
          width: 44,
          bloomDelay: 92,
          bloomDuration: 70,
          pitchOffset: 0
        })
      },
      // Right auxiliary stem
      {
        type: "branch",
        side: 1,
        branchRatio: 0.45,
        heightRatio: 0.84,
        curveX: 56 + Math.random() * 18,
        thickness: 4.0,
        flower: new TulipBlossom({
          palette: this.rightPalette,
          height: 56,
          width: 45,
          bloomDelay: 104,
          bloomDuration: 70,
          pitchOffset: 4
        })
      }
    ];

    // Stratified leaves: background and foreground for rich botanical depth
    this.bgLeaves = [
      new BotanicalLeaf({ side: -1, stemProgress: 0.22, targetLen: 105, targetWidth: 26, angleOffset: -0.92, curl: 0.35, growthDelay: 32, isForeground: false }),
      new BotanicalLeaf({ side: 1, stemProgress: 0.32, targetLen: 100, targetWidth: 25, angleOffset: 0.88, curl: 0.3, growthDelay: 45, isForeground: false }),
      new BotanicalLeaf({ side: -1, stemProgress: 0.54, targetLen: 88, targetWidth: 22, angleOffset: -0.78, curl: 0.25, growthDelay: 62, isForeground: false })
    ];

    this.fgLeaves = [
      new BotanicalLeaf({ side: 1, stemProgress: 0.62, targetLen: 80, targetWidth: 21, angleOffset: 0.74, curl: 0.25, growthDelay: 72, isForeground: true }),
      new BotanicalLeaf({ side: -1, stemProgress: 0.74, targetLen: 68, targetWidth: 18, angleOffset: -0.68, curl: 0.2, growthDelay: 84, isForeground: true }),
      new BotanicalLeaf({ side: 1, stemProgress: 0.82, targetLen: 60, targetWidth: 17, angleOffset: 0.62, curl: 0.2, growthDelay: 92, isForeground: true })
    ];

    // Fan of grass blades around the root mound
    this.grass = [];
    const bladeCount = 14;
    for (let i = 0; i < bladeCount; i++) {
      const side = (i % 2 === 0 ? -1 : 1) * (0.35 + Math.random() * 0.85);
      const len = 45 + Math.random() * 55;
      const angleOffset = (Math.random() - 0.5) * 0.55;
      const delay = Math.random() * 20;
      this.grass.push(new BaseGrassBlade(this.x + (Math.random() - 0.5) * 18, this.y, side, len, angleOffset, delay));
    }
  }

  update(particles) {
    this.age++;
    this.growthProgress = Math.min(1, this.age / this.stemGrowthDuration);

    for (const blade of this.grass) {
      blade.update();
    }
    for (const leaf of this.bgLeaves) {
      leaf.update();
    }
    for (const leaf of this.fgLeaves) {
      leaf.update();
    }

    const wind = Math.sin(this.age * this.windSpeed + this.windPhase) * 0.1;

    // Central flower update
    const mainEase = easeOutCubic(this.growthProgress);
    const mainTipY = this.y - this.targetHeight * mainEase;
    const mainTipX = this.x + this.stems[0].curveX * mainEase + wind * 18;
    this.stems[0].flower.update(mainTipX, mainTipY, particles);

    // Branch flowers update
    for (let i = 1; i < this.stems.length; i++) {
      const branch = this.stems[i];
      if (this.growthProgress > branch.branchRatio) {
        const branchProgress = Math.min(1, (this.growthProgress - branch.branchRatio) / (1 - branch.branchRatio));
        const branchEase = easeOutCubic(branchProgress);
        const bY = this.y - (this.targetHeight * branch.heightRatio) * branchEase;
        const bX = this.x + branch.curveX * branchEase + wind * 24;
        branch.flower.update(bX, bY, particles);
      }
    }
  }

  draw(ctx) {
    const wind = Math.sin(this.age * this.windSpeed + this.windPhase) * 0.08;

    // 1. Draw grass blades at root base
    for (const blade of this.grass) {
      blade.draw(ctx, wind);
    }

    // Central Stem points
    const mainEase = easeOutCubic(this.growthProgress);
    const currentHeight = this.targetHeight * mainEase;

    const basePt = { x: this.x, y: this.y };
    const midPt = {
      x: this.x + this.stems[0].curveX * 0.5 + wind * 10,
      y: this.y - currentHeight * 0.5
    };
    const tipPt = {
      x: this.x + this.stems[0].curveX * mainEase + wind * 20,
      y: this.y - currentHeight
    };

    // Helper for interpolating stem curve coordinates
    const getStemPt = (t) => {
      const lx = (1 - t) * (1 - t) * basePt.x + 2 * (1 - t) * t * midPt.x + t * t * tipPt.x;
      const ly = (1 - t) * (1 - t) * basePt.y + 2 * (1 - t) * t * midPt.y + t * t * tipPt.y;
      const dx = 2 * (1 - t) * (midPt.x - basePt.x) + 2 * t * (tipPt.x - midPt.x);
      const dy = 2 * (1 - t) * (midPt.y - basePt.y) + 2 * t * (tipPt.y - midPt.y);
      return { x: lx, y: ly, angle: Math.atan2(dy, dx) };
    };

    // 2. Draw Background Leaves
    for (const leaf of this.bgLeaves) {
      if (this.growthProgress >= leaf.stemProgress) {
        const t = leaf.stemProgress / Math.max(0.01, this.growthProgress);
        if (t <= 1) {
          const pt = getStemPt(t);
          leaf.draw(ctx, pt.x, pt.y, pt.angle, wind);
        }
      }
    }

    // Helper to render shaded 3D stem curve
    const renderStemCurve = (x0, y0, cx, cy, x1, y1, thickness) => {
      ctx.save();
      const stemGrad = ctx.createLinearGradient(x0, y0, x1, y1);
      stemGrad.addColorStop(0, "#0e3113");
      stemGrad.addColorStop(0.35, "#1f6a27");
      stemGrad.addColorStop(0.7, "#35a641");
      stemGrad.addColorStop(1, "#5bd669");

      ctx.strokeStyle = stemGrad;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx, cy, x1, y1);
      ctx.stroke();

      // Stem edge highlight sheen
      ctx.strokeStyle = "rgba(180, 255, 175, 0.32)";
      ctx.lineWidth = Math.max(1, thickness * 0.28);
      ctx.beginPath();
      ctx.moveTo(x0 + 1, y0);
      ctx.quadraticCurveTo(cx + 1, cy, x1 + 1, y1);
      ctx.stroke();
      ctx.restore();
    };

    // 3. Draw Side Branch Stems & Flowers
    for (let i = 1; i < this.stems.length; i++) {
      const branch = this.stems[i];
      if (this.growthProgress > branch.branchRatio) {
        const branchProgress = Math.min(1, (this.growthProgress - branch.branchRatio) / (1 - branch.branchRatio));
        const bEase = easeOutCubic(branchProgress);
        const bHeight = this.targetHeight * branch.heightRatio * bEase;

        const attachT = branch.branchRatio;
        const pt = getStemPt(attachT);

        const bTipX = pt.x + branch.curveX * bEase + wind * 22;
        const bTipY = pt.y - bHeight;

        const bCpX = pt.x + branch.curveX * 0.65 * bEase + (branch.side * 14);
        const bCpY = pt.y - bHeight * 0.45;

        renderStemCurve(pt.x, pt.y, bCpX, bCpY, bTipX, bTipY, branch.thickness);

        // Branch flower
        const bDx = bTipX - bCpX;
        const bDy = bTipY - bCpY;
        branch.flower.draw(ctx, bTipX, bTipY, Math.atan2(bDy, bDx), wind);
      }
    }

    // 4. Draw Central Main Stem
    renderStemCurve(basePt.x, basePt.y, midPt.x, midPt.y, tipPt.x, tipPt.y, this.stems[0].thickness);

    // 5. Draw Foreground Leaves (overlaying the stem for 3D realism)
    for (const leaf of this.fgLeaves) {
      if (this.growthProgress >= leaf.stemProgress) {
        const t = leaf.stemProgress / Math.max(0.01, this.growthProgress);
        if (t <= 1) {
          const pt = getStemPt(t);
          leaf.draw(ctx, pt.x, pt.y, pt.angle, wind);
        }
      }
    }

    // 6. Draw Central Main Tulip Flower
    const mainDx = tipPt.x - midPt.x;
    const mainDy = tipPt.y - midPt.y;
    this.stems[0].flower.draw(ctx, tipPt.x, tipPt.y, Math.atan2(mainDy, mainDx), wind);
  }
}

// ==========================================
// 8. Main Application Controller
// ==========================================
class TulipApp {
  constructor() {
    this.canvas = document.getElementById("gardenCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.initialPrompt = document.getElementById("initialPrompt");

    this.plants = [];
    this.particles = [];
    this.ripples = [];
    this.starfield = null;
    this.hasClicked = false;
    this.dpr = window.devicePixelRatio || 1;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Pointer events for instant touch and click support
    this.canvas.addEventListener("pointerdown", (e) => this.handlePointerDown(e));

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (key === "c") {
        this.clearGarden();
      } else if (key === "f") {
        this.toggleFullscreen();
      } else if (key === "m") {
        this.toggleSound();
      }
    });

    // Toolbar buttons
    document.getElementById("soundToggle").addEventListener("click", () => this.toggleSound());
    document.getElementById("clearBtn").addEventListener("click", () => this.clearGarden());
    document.getElementById("fullscreenBtn").addEventListener("click", () => this.toggleFullscreen());

    // Start 60fps render loop
    requestAnimationFrame((t) => this.animate(t));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    if (!this.starfield) {
      this.starfield = new Starfield(this.width, this.height);
    } else {
      this.starfield.resize(this.width, this.height);
    }
  }

  handlePointerDown(e) {
    if (!this.hasClicked) {
      this.hasClicked = true;
      if (this.initialPrompt) {
        this.initialPrompt.classList.add("fade-out");
      }
    }

    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    this.bloomAt(clickX, clickY);
  }

  bloomAt(clickX, clickY) {
    // Select a unique colorful palette for every click
    const palette = getRandomPalette();

    // Spawn an energetic glowing ripple at click point
    this.ripples.push(new ClickRipple(clickX, clickY, palette.outerRim));

    // Calculate natural height and root position:
    // When clicked anywhere on screen, stem shoots up from below
    // so the tulip blossom opens right at or around the click coordinates!
    let originY;
    let targetHeight;

    const availableSpaceBelow = this.height - clickY;

    if (availableSpaceBelow > 200) {
      targetHeight = Math.min(360, Math.max(160, availableSpaceBelow * 0.82));
      originY = Math.min(this.height - 20, clickY + targetHeight);
    } else {
      targetHeight = Math.min(270, Math.max(140, clickY * 0.65));
      originY = Math.min(this.height - 15, clickY + 30);
    }

    const plant = new TulipPlant(clickX, originY, targetHeight, palette);
    this.plants.push(plant);

    // Limit maximum plants to keep 60fps buttery smooth
    if (this.plants.length > 25) {
      this.plants.shift();
    }
  }

  clearGarden() {
    this.plants = [];
    this.particles = [];
    this.ripples = [];
  }

  toggleSound() {
    const isMuted = soundSynth.toggleMute();
    document.getElementById("soundOnIcon").classList.toggle("hidden", isMuted);
    document.getElementById("soundOffIcon").classList.toggle("hidden", !isMuted);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      document.getElementById("fsExpandIcon").classList.add("hidden");
      document.getElementById("fsCompressIcon").classList.remove("hidden");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      document.getElementById("fsExpandIcon").classList.remove("hidden");
      document.getElementById("fsCompressIcon").classList.add("hidden");
    }
  }

  animate(time) {
    // Set transform matrix for razor-sharp Retina/High-DPI rendering
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Pure pitch black background for the interactive tulip bloom canvas
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw ambient starfield
    if (this.starfield) {
      this.starfield.draw(this.ctx, time);
    }

    // Update and draw interactive click ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.update();
      if (rip.life <= 0) {
        this.ripples.splice(i, 1);
      } else {
        rip.draw(this.ctx);
      }
    }

    // Update and draw all tulip plants
    for (let i = 0; i < this.plants.length; i++) {
      this.plants[i].update(this.particles);
      this.plants[i].draw(this.ctx);
    }

    // Update and draw magical pollen particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      } else {
        p.draw(this.ctx);
      }
    }

    requestAnimationFrame((t) => this.animate(t));
  }
}

// Initialize when DOM content is loaded
window.addEventListener("DOMContentLoaded", () => {
  new TulipApp();
});
