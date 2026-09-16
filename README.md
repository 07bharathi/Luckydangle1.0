# 🧿 Lucky Dangle for Windows Laptop

A faithful desktop clone of [Lucky Dangle](https://luckydangle.app/) built specifically for your Windows laptop.

It hangs an interactive lucky charm from the top of your screen that sways naturally while you work, lets all clicks pass straight through to background apps, drops in with keyboard shortcuts, and performs each charm's unique cultural ritual.

---

## 🚀 Quick Start (Run Instantly)

You can launch Lucky Dangle immediately in any of these ways:

1. **Double-click `run-dangle.bat`** in this folder.
2. Or from PowerShell / Command Prompt:
   ```bash
   npm start
   ```

---

## ✨ Features

- **Transparent Screen Overlay**: Sits at the very top of your display with zero borders, zero background, and zero window shadows.
- **Smart Click-Through**: Everything outside the charm is 100% click-through! You can click your code editor, browser, games, and applications underneath without any interference.
- **Realistic Rope Physics Engine**:
  - Verlet integration pendulum simulation with natural ambient breeze and inertia.
  - Interactive grab & drag: flick the charm with cursor momentum.
  - **Screen-edge anchor slide**: Drag the small bar or cord near the top of the screen to slide the charm anywhere along your laptop bezel.
- **All 12 Authentic Charms & Cultural Rituals**:
  1. **Nazar boncuğu** (Turkey / Mediterranean) — Glass eye beads, evil-eye ward; ritual: flick.
  2. **Hamsa** (Middle East / North Africa) — Hand of Fatima; ritual: flick.
  3. **Nimbu-mirchi** (India) — 7 chilies, fresh lemon, and black coal; ritual: replace with a fresh garland.
  4. **Ghanta** (India) — Sacred temple bell; ritual: rings the bell with authentic chime sound (`ghanta-ring.wav`) and swinging vibration.
  5. **Drishti bommai** (South India) — Fierce guardian against bad glances; ritual: repaints through 7 sacred colors (Traditional Crimson, Azure Blue, Emerald Green, Marigold Orange, Royal Purple, Solar Yellow, Obsidian Black).
  6. **Páncháng jié** (China) — Unbroken red cord knot; ritual: cord cinch and tassel settling.
  7. **Daruma** (Japan) — Wishing doll; 3-step ritual:
     - Step 1: Paint left eye when setting a goal (*"Make a wish"*).
     - Step 2: Paint right eye when goal is achieved (*"Wish granted! 🌟"*).
     - Step 3: Reset (*"Begin anew"*).
  8. **Maneki-neko** (Japan) — Beckoning cat; ritual: animated spring paw wave.
  9. **Horseshoe** (Europe & Americas) — Upright horseshoe with horse-head bead; ritual: flick.
  10. **Scarab** (Ancient Egypt) — Sacred renewal amulet; ritual: golden ceremonial wings opening.
  11. **Himmeli** (Finland) — Rye-straw geometry; ritual: 3D rotating air draft.
  12. **Spider-Man** (Queens, New York) — Upside-down dangling web-slinger with custom spider bead; ritual: swing into action.
  13. **Custom Emoji** — Hang any emoji (e.g. 🍀, 🧿, 🪬, 🕉️, ✨, 🌸, 🐱, 💎) with lucky beads.
- **Windows System Tray Integration**:
  - Sits in your Windows taskbar system tray (near the clock).
  - Right-click tray icon to quick-switch charms, trigger rituals, toggle visibility, or open the gallery.
- **Built-in Editorial Charm Gallery & Settings Window**:
  - View each charm's origin, story, and animated art.
  - One-click to hang any charm.
  - Interactive emoji bar to customize and hang your personal emoji charm.
- **Global Keyboard Shortcuts**:
  - <kbd>Ctrl</kbd> + <kbd>D</kbd> : Dangle / Retract charm from top of screen.
  - <kbd>Ctrl</kbd> + <kbd>S</kbd> : Perform active charm's ritual.

---

## 📦 Building a Standalone Executable ("APK-like" Portable App)

To package Lucky Dangle into a single portable `.exe` that you can run on any Windows PC without Node.js installed:

```bash
npm run dist
```
The resulting `LuckyDangle.exe` will be generated in the `dist/` folder.
