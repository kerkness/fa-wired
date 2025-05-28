<?php

namespace Kerkness\FaWired;

use Illuminate\Support\ServiceProvider;

class FaWiredServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Publish the compiled JavaScript assets
        $this->publishes([
            __DIR__.'/../dist' => public_path('vendor/fa-wired'),
        ], 'fa-wired-assets');

        // Register helper function for getting asset paths
        if (! function_exists('fa_wired_asset')) {
            /**
             * Get the path to a fa-wired asset.
             */
            function fa_wired_asset(string $file = 'fa-wired.js'): string
            {
                // Check if assets are published
                if (file_exists(public_path("vendor/fa-wired/{$file}"))) {
                    return asset("vendor/fa-wired/{$file}");
                }

                // Fall back to vendor directory
                $vendorPath = base_path("vendor/kerkness/fa-wired/dist/{$file}");
                if (file_exists($vendorPath)) {
                    return asset("vendor/kerkness/fa-wired/dist/{$file}");
                }

                throw new \Exception("fa-wired asset not found: {$file}");
            }
        }
    }
}