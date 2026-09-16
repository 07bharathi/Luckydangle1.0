// overlay.js - Main Renderer for the Lucky Dangle Screen Overlay

(function () {
  const container = document.getElementById("dg-container");
  const svg = document.getElementById("dg-svg");
  const defs = document.getElementById("dg-defs");
  const ropeGroup = document.getElementById("dg-rope");
  const garlandGroup = document.getElementById("dg-garland");
  const beadsGroup = document.getElementById("dg-beads");
  const charmGroup = document.getElementById("dg-charm");
  const worldGroup = document.getElementById("dg-world");
  const grabButton = document.getElementById("dg-grab");
  const anchorHandle = document.getElementById("dg-anchor-handle");
  const closeAnchorBtn = document.getElementById("dg-close-anchor");
  const contextMenu = document.getElementById("dg-context-menu");
  const cmQuit = document.getElementById("dg-cm-quit");
  const cmToggle = document.getElementById("dg-cm-toggle");
  const cmGallery = document.getElementById("dg-cm-gallery");
  const cmRitual = document.getElementById("dg-cm-ritual");
  const toastEl = document.getElementById("dg-toast");
  const ghantaAudio = document.getElementById("dg-sound-ghanta");

  if (ghantaAudio) {
    ghantaAudio.volume = 0.4;
  }

  // Load defs
  defs.innerHTML = getSvgDefs();
  const ropePaths = Array.from(ropeGroup.querySelectorAll("path"));

  // App State
  let currentSlug = "nazar";
  let customEmoji = "🍀";
  let currentCharm = CHARMS.find((c) => c.slug === currentSlug) || CHARMS[0];
  let darumaState = 0; // 0: blank, 1: one eye, 2: two eyes
  let drishtiColorIndex = 0;
  let scale = 1.6;

  // Active ritual animations
  let manekiAnimTime = null;
  let scarabAnimTime = null;
  let ghantaAnimTime = null;
  let knotAnimTime = null;
  let himmeliAnimTime = null;

  // Initialize Physics
  const screenWidth = window.innerWidth || 1920;
  const initialAnchorX = Math.round(screenWidth * 0.75 / scale); // default right side of screen

  const physics = new RopePhysics({
    count: 12,
    segment: 15.5,
    hangOffset: currentCharm.hangOffset,
    hangY: -4,
    anchorX: initialAnchorX
  });

  // Keep anchor within bounds on screen resize
  function updateDimensions() {
    const w = window.innerWidth;
    physics.minAX = Math.min(80, (w / scale) * 0.1);
    physics.maxAX = (w / scale) - physics.minAX;
  }
  window.addEventListener("resize", updateDimensions);
  updateDimensions();

  // Mouse capture management with Electron for seamless click-through
  let isMouseOverInteractive = false;

  function setInteractive(interactive) {
    if (isMouseOverInteractive === interactive) return;
    isMouseOverInteractive = interactive;
    if (window.electronAPI) {
      if (interactive) {
        window.electronAPI.setIgnoreMouseEvents(false);
      } else if (!physics.dragging) {
        window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
      }
    }
  }

  // Set default ignore mouse events
  if (window.electronAPI) {
    window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
  }

  grabButton.addEventListener("mouseenter", () => setInteractive(true));
  grabButton.addEventListener("mouseleave", () => {
    if (!physics.dragging && !contextMenu.classList.contains("visible")) setInteractive(false);
  });

  anchorHandle.addEventListener("mouseenter", () => {
    setInteractive(true);
    closeAnchorBtn.style.opacity = "1";
  });
  anchorHandle.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!closeAnchorBtn.matches(":hover") && !anchorHandle.matches(":hover")) {
        closeAnchorBtn.style.opacity = "0";
        if (!physics.dragging && !contextMenu.classList.contains("visible")) setInteractive(false);
      }
    }, 50);
  });

  closeAnchorBtn.addEventListener("mouseenter", () => {
    setInteractive(true);
    closeAnchorBtn.style.opacity = "1";
  });
  closeAnchorBtn.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!closeAnchorBtn.matches(":hover") && !anchorHandle.matches(":hover")) {
        closeAnchorBtn.style.opacity = "0";
        if (!physics.dragging && !contextMenu.classList.contains("visible")) setInteractive(false);
      }
    }, 50);
  });

  closeAnchorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.electronAPI && window.electronAPI.quitApp) {
      window.electronAPI.quitApp();
    }
  });

  // Context Menu logic
  function showContextMenu(x, y) {
    contextMenu.style.left = `${Math.min(x, window.innerWidth - 210)}px`;
    contextMenu.style.top = `${Math.min(y, window.innerHeight - 180)}px`;
    contextMenu.classList.add("visible");
    setInteractive(true);
  }

  function hideContextMenu() {
    if (contextMenu.classList.contains("visible")) {
      contextMenu.classList.remove("visible");
      if (!isMouseOverInteractive && !physics.dragging) {
        setInteractive(false);
      }
    }
  }

  grabButton.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  });

  anchorHandle.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  });

  cmQuit.addEventListener("click", () => {
    hideContextMenu();
    if (window.electronAPI && window.electronAPI.quitApp) {
      window.electronAPI.quitApp();
    }
  });

  cmToggle.addEventListener("click", () => {
    hideContextMenu();
    physics.setDangled(!physics.dangled);
  });

  cmGallery.addEventListener("click", () => {
    hideContextMenu();
    if (window.electronAPI && window.electronAPI.openGallery) {
      window.electronAPI.openGallery();
    }
  });

  cmRitual.addEventListener("click", () => {
    hideContextMenu();
    performRitual();
  });

  window.addEventListener("pointerdown", (e) => {
    if (!contextMenu.contains(e.target) && e.target !== grabButton && e.target !== anchorHandle) {
      hideContextMenu();
    }
  });

  // Top anchor sliding
  let isAnchorDragging = false;
  anchorHandle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isAnchorDragging = true;
    anchorHandle.setPointerCapture(e.pointerId);
    setInteractive(true);
  });

  window.addEventListener("pointermove", (e) => {
    if (isAnchorDragging) {
      const newX = e.clientX / scale;
      physics.anchorX = Math.min(Math.max(newX, physics.minAX), physics.maxAX);
      physics.anchorXTarget = null;
    }
  });

  const stopAnchorDrag = () => {
    if (isAnchorDragging) {
      isAnchorDragging = false;
      if (!isMouseOverInteractive) setInteractive(false);
      saveCurrentSettings();
    }
  };
  anchorHandle.addEventListener("pointerup", stopAnchorDrag);
  anchorHandle.addEventListener("pointercancel", stopAnchorDrag);

  // Grab button interaction (dragging & flicking)
  let dragStartPos = null;
  let dragDistance = 0;

  function getMouseInPhysicsSpace(e) {
    return {
      x: e.clientX / scale,
      y: e.clientY / scale
    };
  }

  grabButton.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragStartPos = getMouseInPhysicsSpace(e);
    dragDistance = 0;
    physics.dragging = true;
    physics.dragTo(dragStartPos);
    grabButton.setPointerCapture(e.pointerId);
    setInteractive(true);
  });

  window.addEventListener("pointermove", (e) => {
    const pos = getMouseInPhysicsSpace(e);
    physics.mouse = pos;
    if (physics.dragging && dragStartPos) {
      const dist = Math.hypot(pos.x - dragStartPos.x, pos.y - dragStartPos.y);
      dragDistance = Math.max(dragDistance, dist);
      physics.dragTo(pos);
    }
  });

  const stopGrabDrag = () => {
    if (physics.dragging) {
      physics.dragging = false;
      physics.dragTarget = null;
      if (dragDistance < 8) {
        // Quick click -> flick!
        physics.flick(22);
      }
      if (!isMouseOverInteractive && !isAnchorDragging) {
        setInteractive(false);
      }
    }
  };

  grabButton.addEventListener("pointerup", stopGrabDrag);
  grabButton.addEventListener("pointercancel", stopGrabDrag);

  // Double click on charm triggers its ritual!
  grabButton.addEventListener("dblclick", (e) => {
    e.preventDefault();
    performRitual();
  });

  // Render Charm Elements
  function buildCharmVisuals() {
    physics.hangOffset = currentCharm.hangOffset;

    // 1. Beads
    if (currentCharm.beads) {
      const b = currentCharm.beads;
      const beadTypes = [b.small, b.big, b.small];
      const sizes = [3.5, b.bigSize / 2, 3.5];
      beadsGroup.innerHTML = beadTypes
        .map((type, idx) => `<g class="dg-bead">${renderBead(type, sizes[idx], customEmoji)}</g>`)
        .join("");
    } else {
      beadsGroup.innerHTML = "";
    }

    // 2. Garland (Nimbu-mirchi)
    if (currentCharm.art.type === "garland") {
      let garlandHtml = "";
      GARLAND_CONFIG.slots.forEach((_, idx) => {
        const spriteIdx = GARLAND_CONFIG.slotSprite[idx];
        const [w, h] = GARLAND_CONFIG.chiliSizes[spriteIdx];
        const flip = idx % 2 === 0 ? "" : ' transform="scale(-1, 1)"';
        garlandHtml += `
          <g class="dg-slot">
            <image href="../assets/charms/nimbu-chili-${spriteIdx + 1}.png" x="${(-w / 2).toFixed(1)}" y="${(-h / 2).toFixed(1)}" width="${w}" height="${h}"${flip}/>
          </g>`;
      });
      garlandGroup.innerHTML = garlandHtml;

      charmGroup.innerHTML = `
        <image href="../assets/charms/nimbu-lemon.png" x="-22" y="-24.3" width="44" height="48.6"/>
        <image href="../assets/charms/nimbu-coal.png" x="-10.5" y="18.6" width="21" height="18.8"/>
      `;
    } else {
      garlandGroup.innerHTML = "";

      // 3. Regular or Compound Charms
      if (currentCharm.slug === "custom") {
        charmGroup.innerHTML = `
          <path class="dg-cord-base" d="M 0 0 L 0 28" fill="none"/>
          <path class="dg-cord-texture" d="M 0 0 L 0 28" fill="none"/>
          <path class="dg-cord-stitch" d="M 0 0 L 0 28" fill="none"/>
          <text x="0" y="22" text-anchor="middle" dominant-baseline="central" font-size="${currentCharm.art.fontSize}">${customEmoji}</text>
        `;
      } else if (currentCharm.slug === "daruma") {
        const [w, h] = currentCharm.art.frame;
        let eyeSvg = "";
        if (darumaState >= 1) {
          // Left eye painted
          eyeSvg += `<circle cx="-10" cy="14" r="3.7" fill="#171416"/><circle cx="-11.4" cy="12.5" r="0.9" fill="rgba(255,255,255,0.85)"/>`;
        }
        if (darumaState >= 2) {
          // Right eye painted
          eyeSvg += `<circle cx="9.7" cy="14" r="3.7" fill="#171416"/><circle cx="8.3" cy="12.5" r="0.9" fill="rgba(255,255,255,0.85)"/>`;
        }
        charmGroup.innerHTML = `
          <image href="${currentCharm.art.src}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
          ${eyeSvg}
        `;
      } else if (currentCharm.slug === "drishti-bommai") {
        const [w, h] = currentCharm.art.frame;
        charmGroup.innerHTML = `
          <image id="dg-drishti" href="${DRISHTI_COLORS[drishtiColorIndex]}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
        `;
      } else if (currentCharm.slug === "maneki-neko") {
        const [w, h] = currentCharm.art.frame;
        charmGroup.innerHTML = `
          <image href="${currentCharm.art.body}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
          <image id="dg-maneki-arm" href="${currentCharm.art.arm}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
        `;
      } else if (currentCharm.slug === "scarab") {
        const [w, h] = currentCharm.art.frame;
        charmGroup.innerHTML = `
          <image id="dg-scarab-wings" opacity="0" href="${currentCharm.art.wings}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
          <image href="${currentCharm.art.body}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
        `;
      } else if (currentCharm.slug === "ghanta") {
        const [w, h] = currentCharm.art.frame;
        charmGroup.innerHTML = `
          <g id="dg-ghanta-body">
            <image href="${currentCharm.art.src}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
            <g filter="url(#dg-tipshadow)">
              <path class="dg-cord-base" d="M 0 -0.5 L 0 6.5" fill="none"/>
              <path class="dg-cord-texture" d="M 0 -0.5 L 0 6.5" fill="none"/>
              <path class="dg-cord-stitch" d="M 0 -0.5 L 0 6.5" fill="none"/>
            </g>
          </g>
        `;
      } else if (currentCharm.slug === "chinese-knot") {
        const [w, h] = currentCharm.art.frame;
        charmGroup.innerHTML = `
          <g id="dg-knot-body">
            <image href="${currentCharm.art.src}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
            <rect x="-2.3" y="-2.3" width="4.6" height="1.7" rx="0.85" fill="#6b1412"/>
            <rect x="-2.3" y="-0.3" width="4.6" height="1.7" rx="0.85" fill="#ad2b21"/>
            <rect x="-2.3" y="1.7" width="4.6" height="1.7" rx="0.85" fill="#6b1412"/>
          </g>
        `;
      } else if (currentCharm.slug === "himmeli") {
        const [w, h] = currentCharm.art.frame;
        charmGroup.innerHTML = `
          <g id="dg-himmeli-body">
            <image href="${currentCharm.art.src}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
          </g>
        `;
      } else {
        // Standard image charms (Nazar, Hamsa, Horseshoe)
        const [w, h] = currentCharm.art.frame;
        let tipHtml = "";
        if (currentCharm.cordEnd?.kind === "tip") {
          tipHtml = `
            <g filter="url(#dg-tipshadow)">
              <path class="dg-cord-base" d="M 0 -0.4 L 0 5.4" fill="none"/>
              <path class="dg-cord-texture" d="M 0 -0.4 L 0 5.4" fill="none"/>
              <path class="dg-cord-stitch" d="M 0 -0.4 L 0 5.4" fill="none"/>
            </g>
          `;
        }
        charmGroup.innerHTML = `
          <image href="${currentCharm.art.src}" x="${(-w / 2).toFixed(1)}" y="${(-currentCharm.attach * h).toFixed(1)}" width="${w}" height="${h}"/>
          ${tipHtml}
        `;
      }
    }
  }

  // Ritual Executor
  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("visible");
    setTimeout(() => {
      toastEl.classList.remove("visible");
    }, 2400);
  }

  function performRitual() {
    const now = performance.now() / 1000;
    const kind = currentCharm.ritual.kind;

    switch (kind) {
      case "ghanta":
        ghantaAnimTime = now;
        if (ghantaAudio) {
          ghantaAudio.currentTime = 0;
          ghantaAudio.play().catch(() => {});
        }
        showToast("Bell rung — clear skies and good luck");
        break;

      case "drishti":
        drishtiColorIndex = (drishtiColorIndex + 1) % DRISHTI_COLORS.length;
        buildCharmVisuals();
        physics.flick(14);
        const colorNames = ["Traditional Crimson", "Azure Blue", "Emerald Green", "Marigold Orange", "Royal Purple", "Solar Yellow", "Obsidian Black"];
        showToast(`Guardian repainted: ${colorNames[drishtiColorIndex]}`);
        break;

      case "daruma":
        darumaState = (darumaState + 1) % 3;
        buildCharmVisuals();
        physics.flick(14);
        if (darumaState === 1) showToast("Goal set — make a wish");
        else if (darumaState === 2) showToast("Goal reached — wish granted! 🌟");
        else showToast("New goal begun");
        break;

      case "maneki":
        manekiAnimTime = now;
        showToast("Beckoning good fortune ✨");
        break;

      case "scarab":
        scarabAnimTime = now;
        showToast("Ceremonial wings spread");
        break;

      case "knot":
        knotAnimTime = now;
        showToast("Good fortune tied in");
        break;

      case "himmeli":
        himmeliAnimTime = now;
        showToast("Turning in the draft");
        break;

      case "garland":
        physics.setDangled(false);
        showToast("Hanging a fresh garland...");
        setTimeout(() => {
          physics.setDangled(true);
        }, 850);
        break;

      case "emoji":
        if (window.electronAPI) {
          window.electronAPI.openGallery();
        }
        physics.flick(25);
        break;

      case "spiderman":
        physics.flick(35);
        showToast("Spider-Man swings into action! 🕸️");
        break;

      default:
        physics.flick(26);
        showToast(currentCharm.name + " blessed");
        break;
    }
  }

  // Update ritual frame animations
  function updateRitualAnimations(now) {
    // 1. Maneki Waving Arm
    if (manekiAnimTime !== null) {
      const elapsed = now - manekiAnimTime;
      const duration = 2.4;
      const armEl = document.getElementById("dg-maneki-arm");
      if (armEl) {
        if (elapsed >= duration) {
          manekiAnimTime = null;
          armEl.removeAttribute("transform");
        } else {
          const t = elapsed / duration;
          const envelope = Math.pow(1 - t, 2);
          const angle = Math.sin(t * Math.PI * 8) * 18 * envelope;
          armEl.setAttribute("transform", `rotate(${angle.toFixed(2)} 24 38)`);
        }
      }
    }

    // 2. Scarab Wings
    if (scarabAnimTime !== null) {
      const elapsed = now - scarabAnimTime;
      const duration = 3.2;
      const wingsEl = document.getElementById("dg-scarab-wings");
      if (wingsEl) {
        if (elapsed >= duration) {
          scarabAnimTime = null;
          wingsEl.setAttribute("opacity", "0");
          wingsEl.removeAttribute("transform");
        } else {
          const t = elapsed / duration;
          const curve = Math.sin(t * Math.PI);
          const opacity = Math.min(curve * 1.5, 1);
          const spreadScale = 0.85 + 0.25 * curve;
          wingsEl.setAttribute("opacity", opacity.toFixed(3));
          wingsEl.setAttribute("transform", `scale(${spreadScale.toFixed(3)} ${spreadScale.toFixed(3)})`);
        }
      }
    }

    // 3. Ghanta Bell Ringing
    if (ghantaAnimTime !== null) {
      const elapsed = now - ghantaAnimTime;
      const duration = 2.2;
      const bellEl = document.getElementById("dg-ghanta-body");
      if (bellEl) {
        if (elapsed >= duration) {
          ghantaAnimTime = null;
          bellEl.removeAttribute("transform");
        } else {
          const angle = 10 * Math.exp(-1.45 * elapsed) * Math.sin(elapsed * Math.PI * 4.3);
          bellEl.setAttribute("transform", `rotate(${angle.toFixed(2)})`);
        }
      }
    }

    // 4. Chinese Knot Cinch
    if (knotAnimTime !== null) {
      const elapsed = now - knotAnimTime;
      const duration = 3.5;
      const knotEl = document.getElementById("dg-knot-body");
      if (knotEl) {
        if (elapsed >= duration) {
          knotAnimTime = null;
          knotEl.removeAttribute("transform");
        } else {
          const cinch = Math.sin(Math.min(elapsed / 0.5, 1) * Math.PI / 2) * Math.exp(-elapsed * 0.8);
          const scaleX = 1 - 0.15 * cinch;
          const scaleY = 1 + 0.12 * cinch;
          const swing = 6 * Math.exp(-elapsed * 0.8) * Math.sin(elapsed * Math.PI * 2);
          knotEl.setAttribute("transform", `rotate(${swing.toFixed(2)}) scale(${scaleX.toFixed(3)} ${scaleY.toFixed(3)})`);
        }
      }
    }

    // 5. Himmeli 3D Turning
    if (himmeliAnimTime !== null) {
      const elapsed = now - himmeliAnimTime;
      const duration = 4.0;
      const himmeliEl = document.getElementById("dg-himmeli-body");
      if (himmeliEl) {
        if (elapsed >= duration) {
          himmeliAnimTime = null;
          himmeliEl.removeAttribute("transform");
        } else {
          const t = elapsed / duration;
          const turns = 3;
          const angle = t * Math.PI * 2 * turns;
          const scaleX = Math.cos(angle);
          himmeliEl.setAttribute("transform", `scale(${scaleX.toFixed(3)} 1)`);
        }
      }
    }
  }

  // Main Render Loop
  function renderFrame() {
    const pts = physics.pts;
    const count = physics.count;
    const end = physics.end;
    const endAngle = physics.endAngle();

    // 1. Draw Cord Curved Path
    let pathD = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < count - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      pathD += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
    }
    pathD += ` L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;

    ropePaths.forEach((path) => path.setAttribute("d", pathD));

    // 2. Position Beads along cord stations
    if (currentCharm.beads) {
      const stations = [34, 24, 15];
      const raise = currentCharm.beads.raise || 0;
      const restLen = physics.restLength;
      const beadElements = beadsGroup.children;

      stations.forEach((dist, idx) => {
        const interp = physics.interpolated(1 - (dist + raise) / restLen);
        const el = beadElements[idx];
        if (el) {
          el.setAttribute(
            "transform",
            `translate(${interp.x.toFixed(2)} ${interp.y.toFixed(2)}) rotate(${(interp.angle * 180 / Math.PI).toFixed(2)})`
          );
        }
      });
    }

    // 3. Position Garland Chilies (if active)
    if (currentCharm.art.type === "garland") {
      const chiliElements = garlandGroup.children;
      GARLAND_CONFIG.slots.forEach((t, idx) => {
        const interp = physics.interpolated(t);
        const rot = ((interp.angle + GARLAND_CONFIG.slotJitter[idx]) * 180 / Math.PI).toFixed(2);
        const el = chiliElements[idx];
        if (el) {
          el.setAttribute("transform", `translate(${interp.x.toFixed(2)} ${interp.y.toFixed(2)}) rotate(${rot})`);
        }
      });
    }

    // 4. Position & Rotate Charm Body
    const charmDeg = (endAngle * 180 / Math.PI).toFixed(2);
    charmGroup.setAttribute("transform", `translate(${end.x.toFixed(2)} ${end.y.toFixed(2)}) rotate(${charmDeg})`);

    // 5. Position Grab Zone Hit Button
    const grabRadius = Math.round(28 * scale);
    grabButton.style.width = `${grabRadius * 2}px`;
    grabButton.style.height = `${grabRadius * 2}px`;
    const grabScreenX = (end.x + physics.hangOffset * Math.sin(endAngle)) * scale;
    const grabScreenY = (end.y + physics.hangOffset * Math.cos(endAngle)) * scale;
    grabButton.style.transform = `translate(${(grabScreenX - grabRadius).toFixed(1)}px, ${(grabScreenY - grabRadius).toFixed(1)}px)`;

    // 6. Position Anchor Slide Handle & Quick Exit Button
    const anchorScreenX = physics.anchorX * scale;
    anchorHandle.style.transform = `translate(${(anchorScreenX - 25).toFixed(1)}px, 0)`;
    closeAnchorBtn.style.transform = `translate(${(anchorScreenX + 32).toFixed(1)}px, 2px)`;

    // Scale root SVG group
    worldGroup.setAttribute("transform", `scale(${scale.toFixed(4)})`);
  }

  // Animation Loop with fixed physics timestep
  let lastTime = 0;
  let accumulator = 0;
  const fixedDt = 1 / 120;

  function loop(nowMs) {
    requestAnimationFrame(loop);
    const nowSec = nowMs / 1000;
    const delta = lastTime === 0 ? fixedDt : Math.min((nowMs - lastTime) / 1000, 0.1);
    lastTime = nowMs;

    accumulator += delta;
    while (accumulator >= fixedDt) {
      physics.step(fixedDt);
      accumulator -= fixedDt;
    }

    updateRitualAnimations(nowSec);
    renderFrame();
  }

  // Settings persistence
  function saveCurrentSettings() {
    if (window.electronAPI) {
      window.electronAPI.saveSettings({
        slug: currentSlug,
        emoji: customEmoji,
        anchorXRatio: physics.anchorX / (window.innerWidth / scale),
        darumaState: darumaState,
        drishtiColorIndex: drishtiColorIndex
      });
    }
  }

  // Change Charm
  function setCharm(slug, emoji) {
    const found = CHARMS.find((c) => c.slug === slug);
    if (!found) return;
    currentSlug = slug;
    currentCharm = found;
    if (emoji) customEmoji = emoji;
    buildCharmVisuals();
    physics.flick(24);
    saveCurrentSettings();
  }

  // IPC Event Listeners from Main Process (Tray / Shortcuts / Gallery)
  if (window.electronAPI) {
    window.electronAPI.onCharmChanged((data) => {
      setCharm(data.slug, data.emoji);
    });

    window.electronAPI.onToggleDangle(() => {
      physics.setDangled(!physics.dangled);
    });

    window.electronAPI.onPerformRitual(() => {
      if (physics.dangled) {
        performRitual();
      } else {
        physics.setDangled(true);
      }
    });

    // Load initial settings
    window.electronAPI.getSettings().then((settings) => {
      if (settings) {
        if (settings.slug) currentSlug = settings.slug;
        if (settings.emoji) customEmoji = settings.emoji;
        if (typeof settings.darumaState === "number") darumaState = settings.darumaState;
        if (typeof settings.drishtiColorIndex === "number") drishtiColorIndex = settings.drishtiColorIndex;
        if (typeof settings.anchorXRatio === "number") {
          const w = window.innerWidth / scale;
          physics.anchorX = Math.min(Math.max(w * settings.anchorXRatio, physics.minAX), physics.maxAX);
        }
        currentCharm = CHARMS.find((c) => c.slug === currentSlug) || CHARMS[0];
      }
      buildCharmVisuals();
    });
  } else {
    buildCharmVisuals();
  }

  // Start animation loop and initial drop-in
  requestAnimationFrame(loop);
  setTimeout(() => {
    physics.setDangled(true);
  }, 450);

  // Global Keybindings within overlay window if focused
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.code === "KeyD") {
      e.preventDefault();
      physics.setDangled(!physics.dangled);
    } else if (e.ctrlKey && e.code === "KeyS") {
      e.preventDefault();
      performRitual();
    }
  });
})();
