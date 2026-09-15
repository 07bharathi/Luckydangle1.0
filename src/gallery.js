// gallery.js - Charm Gallery Window Interactivity

(function () {
  const gridEl = document.getElementById("charms-grid");
  const emojiInput = document.getElementById("emoji-input");
  const btnApplyEmoji = document.getElementById("btn-apply-emoji");
  const emojiPreview = document.getElementById("current-emoji-preview");
  const btnToggleDangle = document.getElementById("btn-toggle-dangle");
  const toggleLabel = document.getElementById("toggle-label");
  const btnRitualQuick = document.getElementById("btn-ritual-quick");

  let activeSlug = "nazar";
  let activeEmoji = "🍀";
  let isDangled = true;

  function renderGrid() {
    gridEl.innerHTML = CHARMS.map((c) => {
      const isActive = c.slug === activeSlug;
      let artContent = "";

      if (c.slug === "custom") {
        artContent = `<div class="card-emoji-art">${activeEmoji}</div>`;
      } else if (c.art.type === "garland") {
        artContent = `<img class="card-img" src="../assets/charms/nimbu-lemon.png" alt="${c.name}"/>`;
      } else if (c.art.type === "compound") {
        artContent = `<img class="card-img" src="${c.art.body || c.art.fallback}" alt="${c.name}"/>`;
      } else {
        artContent = `<img class="card-img" src="${c.art.src}" alt="${c.name}"/>`;
      }

      return `
        <article class="charm-card ${isActive ? "active" : ""}" data-slug="${c.slug}">
          ${isActive ? '<span class="active-badge">Hanging</span>' : ""}
          <div class="card-art">
            ${artContent}
          </div>
          <h3 class="card-title">${c.name}</h3>
          <span class="card-origin">${c.origin}</span>
          <p class="card-desc">${c.description}</p>
          <div class="card-actions">
            <button class="card-btn hang" data-slug="${c.slug}">
              ${isActive ? "✓ Hanging" : "Hang charm"}
            </button>
            <button class="card-btn ritual" data-slug="${c.slug}">
              ${c.ritual.label}
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Attach card event listeners
    gridEl.querySelectorAll(".card-btn.hang").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slug = btn.dataset.slug;
        selectCharm(slug);
      });
    });

    gridEl.querySelectorAll(".card-btn.ritual").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slug = btn.dataset.slug;
        if (slug !== activeSlug) {
          selectCharm(slug);
          setTimeout(() => {
            if (window.electronAPI) window.electronAPI.triggerRitual();
          }, 300);
        } else {
          if (window.electronAPI) window.electronAPI.triggerRitual();
        }
      });
    });
  }

  function selectCharm(slug, emoji = activeEmoji) {
    activeSlug = slug;
    if (emoji) activeEmoji = emoji;
    if (window.electronAPI) {
      window.electronAPI.selectCharm(slug, emoji);
    }
    renderGrid();
  }

  // Quick Emoji Pickers
  document.querySelectorAll(".emoji-quick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const emoji = btn.dataset.emoji;
      emojiInput.value = emoji;
      emojiPreview.textContent = emoji;
      selectCharm("custom", emoji);
    });
  });

  // Apply typed emoji
  btnApplyEmoji.addEventListener("click", () => {
    const emoji = emojiInput.value.trim();
    if (emoji) {
      emojiPreview.textContent = emoji;
      selectCharm("custom", emoji);
    }
  });

  emojiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btnApplyEmoji.click();
    }
  });

  // Top header actions
  btnToggleDangle.addEventListener("click", () => {
    isDangled = !isDangled;
    toggleLabel.textContent = isDangled ? "Hide Charm" : "Dangle Charm";
    if (window.electronAPI) {
      window.electronAPI.toggleDangle();
    }
  });

  btnRitualQuick.addEventListener("click", () => {
    if (window.electronAPI) {
      window.electronAPI.triggerRitual();
    }
  });

  // Sync settings on load
  if (window.electronAPI) {
    window.electronAPI.getSettings().then((settings) => {
      if (settings) {
        if (settings.slug) activeSlug = settings.slug;
        if (settings.emoji) {
          activeEmoji = settings.emoji;
          emojiInput.value = activeEmoji;
          emojiPreview.textContent = activeEmoji;
        }
      }
      renderGrid();
    });

    window.electronAPI.onCharmChanged((data) => {
      activeSlug = data.slug;
      if (data.emoji) {
        activeEmoji = data.emoji;
        emojiInput.value = activeEmoji;
        emojiPreview.textContent = activeEmoji;
      }
      renderGrid();
    });
  } else {
    renderGrid();
  }
})();
