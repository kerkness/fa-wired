// src/resources/js/fa-wired.d.ts
declare global {
    interface Window {
        fathom?: {
            trackEvent(eventName: string, options?: { _value?: number }): void;
        };
        Alpine?: any;
        Livewire?: any;
        FaWired?: typeof FaWired;
    }
}

export interface FathomTrackingOptions {
    event: string;
    value?: number;
}

export interface FathomStore {
    /**
     * Track a simple event
     */
    track(eventName: string, value?: number | null): void;

    /**
     * Track click events
     */
    click(eventName: string, value?: number | null): void;

    /**
     * Track form submissions
     */
    submit(eventName: string, value?: number | null): void;

    /**
     * Track conversions with value (value in cents)
     */
    conversion(eventName: string, value: number): void;

    /**
     * Track download events
     */
    download(fileName: string, eventName?: string | null): void;

    /**
     * Track external link clicks
     */
    externalLink(url: string, eventName?: string | null): void;
}

export interface LivewireTrackingEvent {
    event: string;
    value?: number;
}

export interface FaWiredConfig {
    autoTrackExternalLinks?: boolean;
    autoTrackDownloads?: boolean;
}

declare module 'alpinejs' {
    interface Alpine {
        store(name: 'fathom'): FathomStore;
        magic(name: 'fathom'): () => FathomStore;
        directive(name: string, callback: any): void;
    }
}

export declare const FaWired: {
    version: string;
    buildDate: string;
    config: FaWiredConfig;
    init(): void;
    configure(options: Partial<FaWiredConfig>): void;
    initializeAlpine(): void;
    initializeLivewire(): void;
    initializeAutoTracking(): void;
};

export default FaWired;