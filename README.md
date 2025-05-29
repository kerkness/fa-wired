# fa-wired

[![Latest Version](https://img.shields.io/packagist/v/kerkness/fa-wired.svg?style=flat-square)](https://packagist.org/packages/kerkness/fa-wired)
[![License](https://img.shields.io/packagist/l/kerkness/fa-wired.svg?style=flat-square)](https://packagist.org/packages/kerkness/fa-wired)

A Laravel package that provides Alpine.js directives and magic helpers for seamless Fathom Analytics event tracking in Blade templates and Livewire components.

## Features

- 🎯 **Alpine.js Directives** - Simple HTML attributes for tracking clicks, form submissions, downloads, and external links
- ✨ **Magic Helper** - `$fathom` magic helper for programmatic tracking in JS
- 🔥 **Livewire Integration** - dispatch tracking events from Livewire components
- 📊 **Track E-commerce Values** - Track conversions with values in cents

## Requirements

- **Laravel 10+**
- **PHP 8.2+**
- **Alpine.js 3.x**
- **Livewire 3.x**
- **Fathom Analytics account** with script included in your site

## Installation

### 1. Install via Composer

```bash
composer require kerkness/fa-wired
```

### 2. Include the JavaScript

#### Option A: Import in your build process (Recommended)

If you're using Vite, or another build tool:

```javascript
// In your app.js or main JavaScript file
import 'vendor/kerkness/fa-wired/dist/fa-wired.esm.js';

// Or with explicit import
import FaWired from 'vendor/kerkness/fa-wired/dist/fa-wired.esm.js';
```

#### Option B: Include directly in Blade template

```html
<!-- Your existing scripts -->
<script src="https://cdn.usefathom.com/script.js" data-site="YOUR-SITE-ID" defer></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- fa-wired from vendor directory -->
<script src="{{ asset('vendor/kerkness/fa-wired/dist/fa-wired.js') }}"></script>
```

#### Option C: Via CDN (Alternative)
```html
<script src="https://cdn.jsdelivr.net/gh/kerkness/fa-wired@latest/dist/fa-wired.js"></script>
```

### 3. Publish Assets (Optional)

If you want to customize or host the JavaScript yourself:

```bash
php artisan vendor:publish --provider="Kerkness\FaWired\FaWiredServiceProvider" --tag="fa-wired-assets"
```

This will copy the compiled JavaScript files to `public/vendor/fa-wired/`.

## Quick Start

### Track Button Clicks
```html
<button x-track-click="'header cta'">Get Started</button>
```

### Track Form Submissions
```html
<form x-track-submit="'newsletter signup'">
    <input type="email" placeholder="Enter email">
    <button type="submit">Subscribe</button>
</form>
```

### Track from Livewire Components
```php
// In your Livewire component
public function submit()
{
    // Process form...
    
    $this->dispatch('fathom-track', name: 'contact form submitted');
}
```

## Usage Guide

### Alpine.js Directives

#### Simple Click Tracking
```html
<button x-track-click="'button click'">
    Track Simple Click
</button>
```

#### Click Tracking with Value
```html
<button x-track-click="{ event: 'premium button', value: 2500 }">
    Track Click with Value ($25.00)
</button>
```

#### Form Submission Tracking
```html
<form x-track-submit="'newsletter signup'">
    <input type="email" placeholder="Enter email">
    <button type="submit">Subscribe</button>
</form>
```

#### Download Tracking
```html
<!-- Auto-named download event -->
<a href="/files/guide.pdf" x-track-download>
    Download User Guide
</a>

<!-- Custom event name -->
<a href="/files/pricing.pdf" x-track-download="'pricing guide download'">
    Download Pricing
</a>
```

#### External Link Tracking
```html
<a href="https://example.com" x-track-external="'partner site visit'">
    Visit Partner Site
</a>
```

### Magic Helper ($fathom)

#### Simple Event Tracking
```html
<button @click="$fathom.track('magic helper test')">
    Simple Track
</button>
```

#### Conversion Tracking
```html
<div x-data="{ productPrice: 4999 }">
    <button @click="$fathom.conversion('product purchase', productPrice)">
        Track Conversion ($49.99)
    </button>
</div>
```

#### Advanced Usage
```html
<div x-data="{ 
    trackingData: { clicks: 0 },
    trackComplexEvent() {
        this.trackingData.clicks++;
        $fathom.track('complex interaction', this.trackingData.clicks * 100);
    }
}">
    <button @click="trackComplexEvent()">
        Complex Tracking
    </button>
</div>
```

### Livewire Integration

#### In your Livewire Component (PHP)

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ContactForm extends Component
{
    public function submit()
    {
        // Process form...
        
        // Track simple event
        $this->dispatch('fathom-track', name: 'contact form submitted');
        
        // Track with value (e.g., for lead scoring)
        $this->dispatch('fathom-track', 
            name: 'high value lead', 
            value: 5000 // $50.00 in cents
        );
    }
    
    public function purchaseSubscription($planPrice)
    {
        // Process purchase...
        
        // Track conversion
        $this->dispatch('fathom-conversion', 
            name: 'subscription purchased', 
            value: $planPrice * 100 // Convert to cents
        );
    }
    
    public function registerUser()
    {
        // Process registration...
        
        // Track form submission
        $this->dispatch('fathom-form-submit', name: 'user registration');
    }
}
```

### Laravel Blade Examples

#### Dynamic Event Names
```blade
<button x-track-click="'product view: {{ $product->name }}'">
    View {{ $product->name }}
</button>
```

#### Conditional Tracking
```blade
@if($user->isPremium())
    <button x-track-click="{ event: 'premium feature used', value: 1000 }">
        Premium Feature
    </button>
@else
    <button x-track-click="'upgrade prompt shown'">
        Upgrade to Premium
    </button>
@endif
```

## E-commerce Example

```html
<div x-data="{ 
    cart: { total: 0, items: [] },
    addToCart(product, price) {
        this.cart.items.push(product);
        this.cart.total += price;
        $fathom.track('add to cart: ' + product, price);
    },
    checkout() {
        $fathom.conversion('checkout completed', this.cart.total);
    }
}">
    <p>Cart Total: $<span x-text="(cart.total / 100).toFixed(2)"></span></p>
    
    <button @click="addToCart('Widget A', 1999)">
        Add Widget A ($19.99)
    </button>
    
    <button @click="addToCart('Widget B', 2999)">
        Add Widget B ($29.99)
    </button>
    
    <button @click="checkout()" x-show="cart.total > 0">
        Checkout
    </button>
</div>
```

## API Reference

### Available Methods

#### Alpine Store Methods
```javascript
Alpine.store('fathom').track(eventName, value)
Alpine.store('fathom').click(eventName, value)
Alpine.store('fathom').submit(eventName, value)
Alpine.store('fathom').conversion(eventName, value)
Alpine.store('fathom').download(fileName, eventName)
Alpine.store('fathom').externalLink(url, eventName)
```

#### Magic Helper Methods
```javascript
$fathom.track(eventName, value)
$fathom.click(eventName, value)
$fathom.submit(eventName, value)
$fathom.conversion(eventName, value)
$fathom.download(fileName, eventName)
$fathom.externalLink(url, eventName)
```

#### Livewire Events
```php
$this->dispatch('fathom-track', name: 'event name', value: 1000);
$this->dispatch('fathom-form-submit', name: 'event name', value: 1000);
$this->dispatch('fathom-conversion', name: 'event name', value: 1000);
```

## Configuration

### Auto-tracking Features

By default, auto-tracking is disabled. You can enable it like this:

```javascript
// Enable auto-tracking for external links and downloads
FaWired.configure({
    autoTrackExternalLinks: true,
    autoTrackDownloads: true
});
```

## Best Practices

### Event Naming
- Use descriptive, consistent names
- Avoid special characters and emojis
- Use lowercase with spaces or underscores
- Examples: `newsletter signup`, `product_purchase`, `file download`

### Value Tracking
- Always provide values in cents (100 = $1.00)
- Use consistent currency across your site
- Set currency in Fathom dashboard settings

### Common Event Types
```javascript
// User interactions
$fathom.track('button click: header cta');
$fathom.track('menu opened');
$fathom.track('search performed');

// Form submissions
$fathom.submit('contact form');
$fathom.submit('newsletter signup');
$fathom.submit('user registration');

// E-commerce
$fathom.conversion('product purchased', 2999);
$fathom.track('add to cart', 1999);
$fathom.track('checkout started');

// Content engagement
$fathom.track('video play');
$fathom.download('user-guide.pdf');
$fathom.externalLink('https://partner.com');
```

## Troubleshooting

### Common Issues

1. **Events not tracking**: Ensure Fathom script loads before fa-wired
2. **Console warnings**: Check that `fathom` object exists globally
3. **Livewire events not firing**: Verify event names match exactly

### Debug Mode
Enable debug mode to see all tracking calls:

```javascript
// Add this after fa-wired loads
Alpine.store('fathom').track = function(eventName, value = null) {
    console.log('Tracking:', eventName, value); // Debug line
    if (typeof fathom === 'undefined') {
        console.warn('Fathom Analytics not loaded');
        return;
    }
    const options = value ? { _value: value } : {};
    fathom.trackEvent(eventName, options);
};
```

### Script Load Order
Make sure scripts load in this order:
1. Fathom Analytics script
2. Alpine.js
3. fa-wired
4. Your custom scripts

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
