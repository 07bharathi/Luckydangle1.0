// physics.js - Verlet Integration Pendulum Physics Engine for Lucky Dangle

class RopePhysics {
  constructor(options = {}) {
    this.count = options.count || 12;
    this.segment = options.segment || 15.5;
    this.hangOffset = options.hangOffset || 22.4;
    this.hangY = options.hangY !== undefined ? options.hangY : -4;
    this.offscreenY = -260.5;

    this.anchorX = options.anchorX || 400;
    this.anchorY = this.offscreenY;
    this.anchorXTarget = null;
    this.minAX = 80;
    this.maxAX = 1800;

    this.dropEase = 0.08;
    this.dangled = false;
    this.dragging = false;
    this.dragTarget = null;
    this.mouse = null;
    this.lastMouse = null;
    this.mVX = 0;
    this.mVY = 0;
    this.elapsed = 0;
    this.dipRemaining = 0;
    this.dipY = 0;
    this.liftT = -1;
    this.liftFromY = 0;

    this.onAnchorSlide = null;

    // Initialize rope points
    this.pts = Array.from({ length: this.count }, (_, i) => ({
      x: this.anchorX,
      y: this.offscreenY + i * this.segment,
      px: this.anchorX,
      py: this.offscreenY + i * this.segment
    }));
  }

  get end() {
    return this.pts[this.count - 1];
  }

  get restLength() {
    return this.segment * (this.count - 1);
  }

  get maxLen() {
    return this.restLength * 1.45;
  }

  hangTarget() {
    return this.hangY - this.hangOffset;
  }

  endAngle() {
    const p1 = this.pts[this.count - 2];
    const p2 = this.pts[this.count - 1];
    return Math.atan2(p2.x - p1.x, p2.y - p1.y);
  }

  interpolated(t) {
    const clamped = Math.min(Math.max(t, 0), 1) * (this.count - 1);
    const idx = Math.min(Math.floor(clamped), this.count - 2);
    const frac = clamped - idx;
    const p1 = this.pts[idx];
    const p2 = this.pts[idx + 1];
    return {
      x: p1.x + (p2.x - p1.x) * frac,
      y: p1.y + (p2.y - p1.y) * frac,
      angle: Math.atan2(p2.x - p1.x, p2.y - p1.y)
    };
  }

  flick(force = 20) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    this.end.px += (force + Math.random() * 8) * dir;
  }

  setDangled(dangle) {
    if (dangle === this.dangled) return;
    this.dangled = dangle;
    if (dangle) {
      this.dipRemaining = 0;
      this.liftT = -1;
      this.flick(24);
    } else {
      this.dipRemaining = 0.18;
      this.dipY = this.anchorY + 16;
    }
  }

  dragTo(pos) {
    const dx = pos.x - this.anchorX;
    const dy = pos.y - this.anchorY;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const len = Math.min(Math.max(dist - this.hangOffset, 1), this.maxLen);
    this.dragTarget = {
      x: this.anchorX + (dx / dist) * len,
      y: this.anchorY + (dy / dist) * len
    };
  }

  step(dt = 1 / 120) {
    const pts = this.pts;
    const end = this.end;
    this.elapsed += dt;

    // Anchor X smooth sliding to target if set
    if (this.anchorXTarget !== null && !this.dragging) {
      const diff = this.anchorXTarget - this.anchorX;
      this.anchorX += Math.max(-4, Math.min(4, diff * 0.04));
      if (Math.abs(this.anchorXTarget - this.anchorX) < 0.5) {
        this.anchorX = this.anchorXTarget;
      }
    }

    // Drop-in or Retract animation
    if (this.dangled) {
      this.liftT = -1;
      const targetY = this.hangTarget();
      this.anchorY += (targetY - this.anchorY) * this.dropEase;
      if (Math.abs(this.anchorY - targetY) < 0.5) {
        this.anchorY = targetY;
      }
    } else if (this.dipRemaining > 0) {
      this.dipRemaining -= dt;
      this.anchorY += (this.dipY - this.anchorY) * 0.15;
      if (this.dipRemaining <= 0) {
        this.liftT = 0;
        this.liftFromY = this.anchorY;
      }
    } else if (this.liftT >= 0) {
      this.liftT += dt;
      const progress = Math.min(this.liftT / 0.3, 1);
      const ease = progress * progress * (3 - 2 * progress);
      this.anchorY = this.liftFromY + (this.offscreenY - this.liftFromY) * ease;
      if (progress >= 1) {
        this.liftT = -1;
      }
    }

    // Ambient gentle breeze / pendulum swing
    const ambient = 0.0035 * Math.sin(this.elapsed * 0.55) + 0.002 * Math.sin(this.elapsed * 1.3 + 0.8);

    // Verlet integration step on rope nodes
    for (let i = 1; i < this.count; i++) {
      const p = pts[i];
      const vx = (p.x - p.px) * 0.985;
      const vy = (p.y - p.py) * 0.985;
      p.px = p.x;
      p.py = p.y;
      p.x += vx + ambient * (i / (this.count - 1));
      p.y += vy + 0.13; // gravity
    }

    // Mouse interaction when hovering
    if (this.mouse && !this.dragging) {
      if (this.lastMouse) {
        this.mVX = this.mVX * 0.75 + (this.mouse.x - this.lastMouse.x) * 0.25;
        this.mVY = this.mVY * 0.75 + (this.mouse.y - this.lastMouse.y) * 0.25;
      }
      this.lastMouse = { ...this.mouse };

      const angle = this.endAngle();
      const hx = end.x + this.hangOffset * Math.sin(angle);
      const hy = end.y + this.hangOffset * Math.cos(angle);
      const dx = hx - this.mouse.x;
      const dy = hy - this.mouse.y;
      const dist = Math.hypot(dx, dy);
      const radius = 42;

      if (dist < radius && dist > 0.5) {
        const factor = (radius - dist) / radius;
        const push = factor * factor * 0.45;
        const nudgeX = (dx / dist) * push + Math.max(-14, Math.min(14, this.mVX)) * factor * 0.1;
        const nudgeY = (dy / dist) * push + Math.max(-14, Math.min(14, this.mVY)) * factor * 0.1;
        end.x += nudgeX;
        end.y += nudgeY * 0.35;
      }

      for (let i = 1; i < this.count - 2; i++) {
        const p = pts[i];
        const rx = p.x - this.mouse.x;
        const ry = p.y - this.mouse.y;
        const d2 = rx * rx + ry * ry;
        if (d2 < 1600 && d2 > 1) {
          const d = Math.sqrt(d2);
          const push = ((40 - d) / 40) * 0.8;
          p.x += (rx / d) * push;
          p.y += (ry / d) * push;
        }
      }
    } else {
      this.lastMouse = null;
      this.mVX = 0;
      this.mVY = 0;
    }

    // Dragging near top edge slides the anchor along the screen top
    if (this.dragging && this.dragTarget && this.dragTarget.y < 70) {
      this.anchorX += (this.dragTarget.x - this.anchorX) * 0.15;
      this.anchorX = Math.min(Math.max(this.anchorX, this.minAX), this.maxAX);
      if (this.onAnchorSlide) {
        this.onAnchorSlide(this.anchorX);
      }
    }

    // Constraint relaxation passes (maintains distance between rope segments)
    const segLen = this.segment;
    for (let pass = 0; pass < 5; pass++) {
      pts[0].x = this.anchorX;
      pts[0].y = this.anchorY;

      if (this.dragging && this.dragTarget) {
        end.x = this.dragTarget.x;
        end.y = this.dragTarget.y;
      }

      for (let i = 0; i < this.count - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const d = Math.max(Math.hypot(dx, dy), 1e-4);
        const diff = (d - segLen) / d / 2;
        const offsetX = dx * diff;
        const offsetY = dy * diff;

        if (i === 0) {
          p2.x -= offsetX * 2;
          p2.y -= offsetY * 2;
        } else if (this.dragging && i === this.count - 2) {
          p1.x += offsetX * 2;
          p1.y += offsetY * 2;
        } else {
          p1.x += offsetX;
          p1.y += offsetY;
          p2.x -= offsetX;
          p2.y -= offsetY;
        }
      }
    }
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RopePhysics };
}
