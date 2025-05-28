/*!
 * fa-wired v1.0.0
 * Fathom Analytics Alpine.js wrapper for Laravel/Livewire
 * (c) 2025 kerkness
 * Released under the MIT License
 * https://github.com/kerkness/fa-wired
 */
/*!
 * fa-wired - Fathom Analytics Alpine.js wrapper for Laravel/Livewire
 * https://github.com/kerkness/fa-wired
 */
const VERSION = "1.0.0";
const BUILD_DATE = "2025-05-28T19:10:27.775Z";
const FaWired = {
  version: VERSION,
  buildDate: BUILD_DATE,
  // Initialize the Alpine.js integration
  init() {
    if (typeof document === "undefined") {
      console.warn("fa-wired: Document not available, skipping initialization");
      return;
    }
    if (typeof Alpine !== "undefined") {
      this.initializeAlpine();
    } else {
      document.addEventListener("alpine:init", () => {
        this.initializeAlpine();
      });
    }
    if (typeof Livewire !== "undefined") {
      this.initializeLivewire();
    } else {
      document.addEventListener("livewire:init", () => {
        this.initializeLivewire();
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initializeAutoTracking();
      });
    } else {
      this.initializeAutoTracking();
    }
  },
  // Initialize Alpine.js components
  initializeAlpine() {
    Alpine.store("fathom", {
      // Track a simple event
      track(eventName, value = null) {
        if (typeof fathom === "undefined") {
          console.warn("fa-wired: Fathom Analytics not loaded");
          return;
        }
        const options = value ? { _value: value } : {};
        fathom.trackEvent(eventName, options);
      },
      // Track click events
      click(eventName, value = null) {
        this.track(eventName, value);
      },
      // Track form submissions
      submit(eventName, value = null) {
        this.track(eventName, value);
      },
      // Track conversions with value (value in cents)
      conversion(eventName, value) {
        this.track(eventName, value);
      },
      // Track download events
      download(fileName, eventName = null) {
        const name = eventName || `file download: ${fileName}`;
        this.track(name);
      },
      // Track external link clicks
      externalLink(url, eventName = null) {
        const name = eventName || `external link: ${url}`;
        this.track(name);
      }
    });
    Alpine.magic("fathom", () => Alpine.store("fathom"));
    Alpine.directive("track-click", (el, { expression }, { evaluate }) => {
      const config = evaluate(expression);
      const eventName = typeof config === "string" ? config : config.event;
      const value = typeof config === "object" ? config.value : null;
      el.addEventListener("click", () => {
        Alpine.store("fathom").click(eventName, value);
      });
    });
    Alpine.directive("track-submit", (el, { expression }, { evaluate }) => {
      const config = evaluate(expression);
      const eventName = typeof config === "string" ? config : config.event;
      const value = typeof config === "object" ? config.value : null;
      el.addEventListener("submit", () => {
        Alpine.store("fathom").submit(eventName, value);
      });
    });
    Alpine.directive("track-download", (el, { expression }, { evaluate }) => {
      const config = evaluate(expression);
      const eventName = typeof config === "string" ? config : config.event;
      el.addEventListener("click", (e) => {
        const href = el.getAttribute("href");
        const fileName = href ? href.split("/").pop() : "unknown";
        Alpine.store("fathom").download(fileName, eventName);
      });
    });
    Alpine.directive("track-external", (el, { expression }, { evaluate }) => {
      const config = evaluate(expression);
      const eventName = typeof config === "string" ? config : config.event;
      el.addEventListener("click", (e) => {
        const href = el.getAttribute("href");
        Alpine.store("fathom").externalLink(href, eventName);
      });
    });
  },
  // Initialize Livewire integration
  initializeLivewire() {
    Livewire.on("fathom-track", (data) => {
      Alpine.store("fathom").track(data.name, data.value || null);
    });
    Livewire.on("fathom-form-submit", (data) => {
      Alpine.store("fathom").submit(data.name, data.value || null);
    });
    Livewire.on("fathom-conversion", (data) => {
      Alpine.store("fathom").conversion(data.name, data.value);
    });
  },
  // Initialize automatic tracking features
  initializeAutoTracking() {
    var _a, _b;
    if ((_a = this.config) == null ? void 0 : _a.autoTrackExternalLinks) {
      document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach((link) => {
        link.addEventListener("click", () => {
          Alpine.store("fathom").externalLink(link.href);
        });
      });
    }
    if ((_b = this.config) == null ? void 0 : _b.autoTrackDownloads) {
      document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"]').forEach((link) => {
        link.addEventListener("click", () => {
          const fileName = link.href.split("/").pop();
          Alpine.store("fathom").download(fileName);
        });
      });
    }
  },
  // Configuration object for optional features
  config: {
    autoTrackExternalLinks: false,
    autoTrackDownloads: false
  },
  // Method to update configuration
  configure(options) {
    this.config = { ...this.config, ...options };
  }
};
if (typeof window !== "undefined") {
  window.FaWired = FaWired;
  FaWired.init();
  if (process.env.NODE_ENV === "development") {
    console.log(`fa-wired v${VERSION} initialized`);
  }
}
export {
  FaWired as default
};
//# sourceMappingURL=fa-wired.esm.js.map
