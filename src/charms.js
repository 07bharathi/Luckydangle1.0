// charms.js - Catalog, Beads, and Asset definitions for Lucky Dangle

const CHARMS = [
  {
    slug: "nazar",
    name: "Nazar boncuğu",
    origin: "Turkey and the Mediterranean",
    description: "A glass eye worn against the evil eye. Give it a flick when you want a little cover.",
    ritual: { kind: "flick", label: "Give it a flick" },
    art: { type: "image", src: "../assets/charms/nazar.png", frame: [64, 64] },
    attach: 0.15,
    hangOffset: 22.4,
    beads: { small: "glass:white", big: "eye", raise: 0, bigSize: 12 }
  },
  {
    slug: "hamsa",
    name: "Hamsa",
    origin: "Middle East and North Africa",
    description: "An open hand carried for protection and good fortune. Give it a flick to send bad luck on its way.",
    ritual: { kind: "flick", label: "Give it a flick" },
    art: { type: "image", src: "../assets/charms/hamsa.png", frame: [64, 84] },
    attach: 0.12,
    hangOffset: 32,
    beads: { small: "glass:gold", big: "glass:deepBlue", raise: 0, bigSize: 12 }
  },
  {
    slug: "nimbu-mirchi",
    name: "Nimbu-mirchi",
    origin: "India",
    description: "Seven chilies and a lemon hung at the threshold to turn away misfortune. Replace it with a fresh one when the week is up.",
    ritual: { kind: "garland", label: "Hang a fresh garland" },
    art: { type: "garland" },
    attach: 0.5,
    hangOffset: 0,
    beads: null
  },
  {
    slug: "ghanta",
    name: "Ghanta",
    origin: "India",
    description: "A bell rung to clear the air and mark a beginning. Ring it when you make a wish, or before something that matters.",
    ritual: { kind: "ghanta", label: "Ring the bell" },
    art: { type: "image", src: "../assets/charms/ghanta.png", frame: [64, 84] },
    attach: 0.073,
    hangOffset: 35.9,
    cordEnd: { kind: "tip", from: [32, 5.6], to: [32, 12.6] },
    beads: { small: "glass:gold", big: "glass:lacquerRed", raise: 0, bigSize: 12 }
  },
  {
    slug: "drishti-bommai",
    name: "Drishti bommai",
    origin: "South India",
    description: "A fierce guardian painted to meet the first bad glance. Repaint it through seven colors whenever you want a fresh start.",
    ritual: { kind: "drishti", label: "Repaint the guardian" },
    art: { type: "image", src: "../assets/charms/drishti-bommai.png", frame: [64, 84] },
    attach: 0.13,
    hangOffset: 31.1,
    beads: { small: "glass:gold", big: "striped", raise: 4, bigSize: 12 }
  },
  {
    slug: "chinese-knot",
    name: "Páncháng jié",
    origin: "China",
    description: "One unbroken red cord tied for good fortune without end. Cinch it gently and let the tassel settle.",
    ritual: { kind: "knot", label: "Tie in good fortune" },
    art: { type: "image", src: "../assets/charms/chinese-knot.png", frame: [64, 84] },
    attach: 0.045,
    hangOffset: 38.2,
    cordEnd: { kind: "binding", center: [32, 4.3] },
    beads: { small: "glass:lacquerRed", big: "glass:gold", raise: 0, bigSize: 12 }
  },
  {
    slug: "daruma",
    name: "Daruma",
    origin: "Japan",
    description: "A wishing doll for goals that take some grit. Paint one eye when you make a wish and the other when it comes true.",
    ritual: { kind: "daruma", label: "Make a wish" },
    art: { type: "image", src: "../assets/charms/daruma.png", frame: [64, 64] },
    attach: 0.14,
    hangOffset: 23,
    beads: { small: "glass:gold", big: "glass:white", raise: 0, bigSize: 12 }
  },
  {
    slug: "maneki-neko",
    name: "Maneki-neko",
    origin: "Japan",
    description: "A beckoning cat that invites good fortune in. Call on it and watch its raised paw wave.",
    ritual: { kind: "maneki", label: "Beckon good fortune" },
    art: {
      type: "compound",
      body: "../assets/charms/maneki-body.png",
      arm: "../assets/charms/maneki-arm.png",
      fallback: "../assets/charms/maneki-neko.png",
      frame: [64, 84],
      pivot: [0.38, 0.44]
    },
    attach: 0.13,
    hangOffset: 31.1,
    beads: { small: "glass:gold", big: "glass:lacquerRed", raise: 4, bigSize: 12 }
  },
  {
    slug: "horseshoe",
    name: "Horseshoe",
    origin: "Europe and the Americas",
    description: "Hung points up so the luck stays put. A good flick is all this one needs.",
    ritual: { kind: "flick", label: "Give it a flick" },
    art: { type: "image", src: "../assets/charms/horseshoe.png", frame: [64, 84] },
    attach: 0.12,
    hangOffset: 31.9,
    cordEnd: { kind: "tip", from: [32.2, 9.7], to: [32.2, 14.3] },
    beads: { small: "hexnut", big: "horsehead", raise: 0, bigSize: 20 }
  },
  {
    slug: "scarab",
    name: "Scarab",
    origin: "Ancient Egypt",
    description: "An ancient amulet for renewal and new beginnings. Spread its ceremonial wings for a moment, then let them rest.",
    ritual: { kind: "scarab", label: "Spread the wings" },
    art: {
      type: "compound",
      body: "../assets/charms/scarab.png",
      wings: "../assets/charms/scarab-wings.png",
      frame: [140.5, 107]
    },
    attach: 0.184,
    hangOffset: 33.8,
    cordEnd: { kind: "tip", from: [70.25, 19.2], to: [70.25, 25] },
    beads: { small: "glass:gold", big: "glass:faience", raise: 4, bigSize: 12 }
  },
  {
    slug: "himmeli",
    name: "Himmeli",
    origin: "Finland",
    description: "A rye-straw tradition for inviting abundance, prosperity, and a fruitful flow of work. Set its open geometry turning on an imagined current of air.",
    ritual: { kind: "himmeli", label: "Set it turning" },
    art: { type: "image", src: "../assets/charms/himmeli.png", frame: [64, 84] },
    attach: 0.05,
    hangOffset: 37.8,
    beads: null
  },
  {
    slug: "spiderman",
    name: "Spider-Man & Gwen",
    origin: "Queens, New York",
    description: "Spider-Man holding his webline with Gwen Stacy. Give him a flick to swing with superhero agility.",
    ritual: { kind: "spiderman", label: "Swing webline" },
    art: { type: "image", src: "../assets/charms/spiderman.png", frame: [48, 179] },
    attach: 0.005,
    hangOffset: 65,
    beads: { small: "glass:deepBlue", big: "spider", raise: 0, bigSize: 13 }
  },
  {
    slug: "custom",
    name: "Emoji",
    origin: "Yours",
    description: "Choose any emoji and make the ritual your own. Hang the one that feels lucky to you.",
    ritual: { kind: "emoji", label: "Pick an emoji" },
    art: { type: "emoji", glyph: "🍀", frame: [64, 64], fontSize: 58 },
    attach: 0.15,
    hangOffset: 22.4,
    beads: { small: "glass:white", big: "emojiTwin", raise: 0, bigSize: 14 }
  },
  {
    slug: "custom-image",
    name: "Custom Image",
    origin: "Your Device",
    description: "Your own uploaded image hanging with lucky beads. Choose any photo or art you love.",
    ritual: { kind: "flick", label: "Give it a flick" },
    art: { type: "image", src: "", frame: [64, 84] },
    attach: 0.03,
    hangOffset: 32,
    beads: { small: "glass:gold", big: "glass:deepBlue", raise: 0, bigSize: 12 }
  }
];

// 7 sacred colors for Drishti Bommai
const DRISHTI_COLORS = [
  "../assets/charms/drishti-bommai.png",
  "../assets/charms/drishti-blue.png",
  "../assets/charms/drishti-green.png",
  "../assets/charms/drishti-orange.png",
  "../assets/charms/drishti-purple.png",
  "../assets/charms/drishti-yellow.png",
  "../assets/charms/drishti-black.png"
];

// Nimbu-mirchi garland composition configuration
const GARLAND_CONFIG = {
  slots: [0.52, 0.58, 0.63, 0.68, 0.73, 0.78, 0.83],
  slotSprite: [1, 4, 2, 6, 0, 3, 5], // 0-indexed indices for nimbu-chili-(1..7).png
  slotJitter: [0.08, -0.12, 0.05, -0.08, 0.13, -0.05, 0.1],
  chiliSizes: [
    [65.2, 16.2],
    [66.0, 8.2],
    [55.6, 11.3],
    [57.8, 12.1],
    [42.3, 11.3],
    [56.8, 10.1],
    [59.1, 9.0]
  ],
  lemon: [44, 48.6],
  coal: [21, 18.8]
};

// SVG Definitions for Cord, Beads, Gradients and Lighting
function getSvgDefs() {
  return `
    <linearGradient id="dg-rope" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#735028"/>
      <stop offset="35%" stop-color="#b88a44"/>
      <stop offset="65%" stop-color="#e2bf7d"/>
      <stop offset="100%" stop-color="#6e4c25"/>
    </linearGradient>

    <!-- Glass Beads: White -->
    <radialGradient id="dg-g-white" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="65%" stop-color="#ebebf0"/>
      <stop offset="100%" stop-color="#9ea1ad"/>
    </radialGradient>
    <radialGradient id="dg-rim-white" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.4)"/>
    </radialGradient>

    <!-- Glass Beads: Gold -->
    <radialGradient id="dg-g-gold" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffe685"/>
      <stop offset="60%" stop-color="#edb52e"/>
      <stop offset="100%" stop-color="#9e6b0a"/>
    </radialGradient>
    <radialGradient id="dg-rim-gold" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(255,217,102,0.5)"/>
    </radialGradient>

    <!-- Glass Beads: Deep Blue -->
    <radialGradient id="dg-g-deepBlue" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#6b8ce0"/>
      <stop offset="60%" stop-color="#294294"/>
      <stop offset="100%" stop-color="#0a1447"/>
    </radialGradient>
    <radialGradient id="dg-rim-deepBlue" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(128,166,255,0.5)"/>
    </radialGradient>

    <!-- Glass Beads: Lacquer Red -->
    <radialGradient id="dg-g-lacquerRed" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ff7a66"/>
      <stop offset="60%" stop-color="#d4211a"/>
      <stop offset="100%" stop-color="#6b050a"/>
    </radialGradient>
    <radialGradient id="dg-rim-lacquerRed" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(255,115,89,0.5)"/>
    </radialGradient>

    <!-- Glass Beads: Faience (Scarab turquoise) -->
    <radialGradient id="dg-g-faience" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#9ef0e3"/>
      <stop offset="60%" stop-color="#29a69e"/>
      <stop offset="100%" stop-color="#084f54"/>
    </radialGradient>
    <radialGradient id="dg-rim-faience" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(140,242,230,0.5)"/>
    </radialGradient>

    <!-- Nazar Eye Bead -->
    <radialGradient id="dg-g-eyeBlue" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3b72e8"/>
      <stop offset="65%" stop-color="#143c96"/>
      <stop offset="100%" stop-color="#0a1b42"/>
    </radialGradient>
    <radialGradient id="dg-rim-eyeBlue" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(100,160,255,0.4)"/>
    </radialGradient>

    <!-- Hex Nut Metal Bead -->
    <linearGradient id="dg-hex" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0e0eb"/>
      <stop offset="45%" stop-color="#8c8c99"/>
      <stop offset="70%" stop-color="#4d4d59"/>
      <stop offset="100%" stop-color="#26262e"/>
    </linearGradient>

    <filter id="dg-tipshadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1" stdDeviation="0.6" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  `;
}

function renderBead(beadType, radius, emojiGlyph = "🍀") {
  if (beadType.startsWith("glass:")) {
    const colorKey = beadType.split(":")[1];
    const r = radius;
    const hx = -r * 0.34;
    const hy = -r * 0.46;
    const rx = r * 0.27;
    const ry = r * 0.2;
    return `
      <circle r="${r}" fill="url(#dg-g-${colorKey})"/>
      <circle r="${r}" fill="url(#dg-rim-${colorKey})"/>
      <ellipse cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" fill="rgba(255,255,255,0.85)"/>
    `;
  }
  if (beadType === "eye") {
    const r = radius;
    return `
      <circle r="${r}" fill="url(#dg-g-eyeBlue)"/>
      <circle r="${(r * 0.55).toFixed(2)}" fill="#ffffff"/>
      <circle r="${(r * 0.35).toFixed(2)}" fill="#73ccfa"/>
      <circle r="${(r * 0.16).toFixed(2)}" fill="#0d0d1a"/>
      <circle r="${r}" fill="url(#dg-rim-eyeBlue)"/>
      <ellipse cx="${(-r * 0.52).toFixed(2)}" cy="${(-r * 0.6).toFixed(2)}" rx="${(r * 0.22).toFixed(2)}" ry="${(r * 0.15).toFixed(2)}" transform="rotate(-30 ${(-r * 0.52).toFixed(2)} ${(-r * 0.6).toFixed(2)})" fill="rgba(255,255,255,0.75)"/>
    `;
  }
  if (beadType === "striped") {
    const r = radius;
    return `
      <circle r="${r}" fill="url(#dg-g-lacquerRed)"/>
      <circle r="${r}" fill="url(#dg-rim-lacquerRed)"/>
      <ellipse cx="${(-r * 0.34).toFixed(2)}" cy="${(-r * 0.46).toFixed(2)}" rx="${(r * 0.27).toFixed(2)}" ry="${(r * 0.2).toFixed(2)}" fill="rgba(255,255,255,0.85)"/>
      <path d="M ${(-r * 0.8).toFixed(2)} ${(-r * 0.2).toFixed(2)} Q 0 ${(r * 0.04).toFixed(2)} ${(r * 0.8).toFixed(2)} ${(-r * 0.2).toFixed(2)}" stroke="rgba(245,194,41,0.85)" stroke-width="1.3" stroke-linecap="round" fill="none"/>
      <path d="M ${(-r * 0.72).toFixed(2)} ${(r * 0.24).toFixed(2)} Q 0 ${(r * 0.52).toFixed(2)} ${(r * 0.72).toFixed(2)} ${(r * 0.24).toFixed(2)}" stroke="rgba(245,194,41,0.75)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    `;
  }
  if (beadType === "hexnut") {
    return `
      <polygon points="3.03,-1.75 0,-3.5 -3.03,-1.75 -3.03,1.75 0,3.5 3.03,1.75" fill="url(#dg-hex)"/>
      <circle r="1.33" fill="#1a1a1f"/>
    `;
  }
  if (beadType === "horsehead") {
    return `<image href="../assets/charms/horse-head-bead.png" x="-10" y="-10" width="20" height="20"/>`;
  }
  if (beadType === "emojiTwin") {
    return `<text text-anchor="middle" dominant-baseline="central" font-size="${radius * 1.8}">${emojiGlyph}</text>`;
  }
  if (beadType === "spider") {
    const r = radius;
    return `
      <circle r="${r}" fill="url(#dg-g-lacquerRed)"/>
      <circle r="${r}" fill="url(#dg-rim-lacquerRed)"/>
      <ellipse cx="0" cy="0.4" rx="${(r * 0.22).toFixed(2)}" ry="${(r * 0.38).toFixed(2)}" fill="#111116"/>
      <circle cx="0" cy="${(-r * 0.36).toFixed(2)}" r="${(r * 0.18).toFixed(2)}" fill="#111116"/>
      <path d="M ${(-r * 0.18).toFixed(2)} ${(-r * 0.1).toFixed(2)} Q ${(-r * 0.55).toFixed(2)} ${(-r * 0.5).toFixed(2)} ${(-r * 0.72).toFixed(2)} ${(-r * 0.2).toFixed(2)}
               M ${(-r * 0.18).toFixed(2)} 0 Q ${(-r * 0.65).toFixed(2)} ${(-r * 0.2).toFixed(2)} ${(-r * 0.78).toFixed(2)} ${(r * 0.1).toFixed(2)}
               M ${(-r * 0.18).toFixed(2)} ${(r * 0.2).toFixed(2)} Q ${(-r * 0.65).toFixed(2)} ${(r * 0.35).toFixed(2)} ${(-r * 0.72).toFixed(2)} ${(r * 0.55).toFixed(2)}
               M ${(-r * 0.14).toFixed(2)} ${(r * 0.35).toFixed(2)} Q ${(-r * 0.45).toFixed(2)} ${(r * 0.65).toFixed(2)} ${(-r * 0.52).toFixed(2)} ${(r * 0.78).toFixed(2)}
               M ${(r * 0.18).toFixed(2)} ${(-r * 0.1).toFixed(2)} Q ${(r * 0.55).toFixed(2)} ${(-r * 0.5).toFixed(2)} ${(r * 0.72).toFixed(2)} ${(-r * 0.2).toFixed(2)}
               M ${(r * 0.18).toFixed(2)} 0 Q ${(r * 0.65).toFixed(2)} ${(-r * 0.2).toFixed(2)} ${(r * 0.78).toFixed(2)} ${(r * 0.1).toFixed(2)}
               M ${(r * 0.18).toFixed(2)} ${(r * 0.2).toFixed(2)} Q ${(r * 0.65).toFixed(2)} ${(r * 0.35).toFixed(2)} ${(r * 0.72).toFixed(2)} ${(r * 0.55).toFixed(2)}
               M ${(r * 0.14).toFixed(2)} ${(r * 0.35).toFixed(2)} Q ${(r * 0.45).toFixed(2)} ${(r * 0.65).toFixed(2)} ${(r * 0.52).toFixed(2)} ${(r * 0.78).toFixed(2)}"
            stroke="#111116" stroke-width="${Math.max(1, (r * 0.12)).toFixed(2)}" stroke-linecap="round" fill="none"/>
      <ellipse cx="${(-r * 0.34).toFixed(2)}" cy="${(-r * 0.46).toFixed(2)}" rx="${(r * 0.25).toFixed(2)}" ry="${(r * 0.18).toFixed(2)}" fill="rgba(255,255,255,0.7)"/>
    `;
  }
  return "";
}

// Export for CommonJS and browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CHARMS,
    DRISHTI_COLORS,
    GARLAND_CONFIG,
    getSvgDefs,
    renderBead
  };
}
