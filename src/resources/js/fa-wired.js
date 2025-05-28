/*!
 * fa-wired - Fathom Analytic Events for Laravel/Livewire
 * https://github.com/kerkness/fa-wired
 */

// Version info (replaced by Vite during build)
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : '1.0.0';
const BUILD_DATE = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString();

// Main FaWired object
const FaWired = {
    version: VERSION,
    buildDate: BUILD_DATE,

    // Initialize the Alpine.js integration
    init() {
        if (typeof document === 'undefined') {
            console.warn('fa-wired: Document not available, skipping initialization');
            return;
        }

        // Wait for Alpine to be ready
        if (typeof Alpine !== 'undefined') {
            this.initializeAlpine();
        } else {
            document.addEventListener('alpine:init', () => {
                this.initializeAlpine();
            });
        }

        // Initialize Livewire integration if available
        if (typeof Livewire !== 'undefined') {
            this.initializeLivewire();
        } else {
            document.addEventListener('livewire:init', () => {
                this.initializeLivewire();
            });
        }

        // Initialize auto-tracking on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeAutoTracking();
            });
        } else {
            this.initializeAutoTracking();
        }
    },

    // Initialize Alpine.js components
    initializeAlpine() {
        // Global Alpine.js store for Fathom tracking
        Alpine.store('fathom', {
            // Track a simple event
            track(eventName, value = null) {
                if (typeof fathom === 'undefined') {
                    console.warn('fa-wired: Fathom Analytics not loaded');
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

        // Alpine.js magic helper for quick access
        Alpine.magic('fathom', () => Alpine.store('fathom'));

        // Alpine.js directive for automatic click tracking
        Alpine.directive('track-click', (el, { expression }, { evaluate }) => {
            const config = evaluate(expression);
            const eventName = typeof config === 'string' ? config : config.event;
            const value = typeof config === 'object' ? config.value : null;

            el.addEventListener('click', () => {
                Alpine.store('fathom').click(eventName, value);
            });
        });

        // Alpine.js directive for automatic form submission tracking
        Alpine.directive('track-submit', (el, { expression }, { evaluate }) => {
            const config = evaluate(expression);
            const eventName = typeof config === 'string' ? config : config.event;
            const value = typeof config === 'object' ? config.value : null;

            el.addEventListener('submit', () => {
                Alpine.store('fathom').submit(eventName, value);
            });
        });

        // Alpine.js directive for download tracking
        Alpine.directive('track-download', (el, { expression }, { evaluate }) => {
            const config = evaluate(expression);
            const eventName = typeof config === 'string' ? config : config.event;

            el.addEventListener('click', (e) => {
                const href = el.getAttribute('href');
                const fileName = href ? href.split('/').pop() : 'unknown';
                Alpine.store('fathom').download(fileName, eventName);
            });
        });

        // Alpine.js directive for external link tracking
        Alpine.directive('track-external', (el, { expression }, { evaluate }) => {
            const config = evaluate(expression);
            const eventName = typeof config === 'string' ? config : config.event;

            el.addEventListener('click', (e) => {
                const href = el.getAttribute('href');
                Alpine.store('fathom').externalLink(href, eventName);
            });
        });
    },

    // Initialize Livewire integration
    initializeLivewire() {
        // Track Livewire component interactions
        Livewire.on('fathom-track', (data) => {
            Alpine.store('fathom').track(data.event, data.value || null);
        });

        // Track Livewire form submissions
        Livewire.on('fathom-form-submit', (data) => {
            Alpine.store('fathom').submit(data.event, data.value || null);
        });

        // Track Livewire conversions
        Livewire.on('fathom-conversion', (data) => {
            Alpine.store('fathom').conversion(data.event, data.value);
        });
    },

    // Initialize automatic tracking features
    initializeAutoTracking() {
        // Auto-track external links (optional - can be enabled via config)
        if (this.config?.autoTrackExternalLinks) {
            document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach(link => {
                link.addEventListener('click', () => {
                    Alpine.store('fathom').externalLink(link.href);
                });
            });
        }

        // Auto-track file downloads (optional - can be enabled via config)
        if (this.config?.autoTrackDownloads) {
            document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"]').forEach(link => {
                link.addEventListener('click', () => {
                    const fileName = link.href.split('/').pop();
                    Alpine.store('fathom').download(fileName);
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

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
    // Make FaWired globally accessible
    window.FaWired = FaWired;

    // Auto-initialize
    FaWired.init();

    // Log version info in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`fa-wired v${VERSION} initialized`);
    }
}

// Export for module systems
export default FaWired;