import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/resources/js/fa-wired.js'),
      name: 'FaWired',
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'fa-wired.esm.js';
          case 'umd':
            return 'fa-wired.umd.js';
          case 'iife':
            return 'fa-wired.js';
          default:
            return `fa-wired.${format}.js`;
        }
      },
      formats: ['es', 'umd', 'iife']
    },
    
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ['alpinejs'],
      
      output: {
        globals: {
          'alpinejs': 'Alpine'
        },
        
        // Add banner with version and build info
        banner: `/*!
 * fa-wired v${process.env.npm_package_version || '1.0.0'}
 * Fathom Analytics Alpine.js wrapper for Laravel/Livewire
 * (c) ${new Date().getFullYear()} kerkness
 * Released under the MIT License
 * https://github.com/kerkness/fa-wired
 */`
      }
    },
    
    // Generate source maps
    sourcemap: true,
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console.warn for debugging
        drop_debugger: true
      },
      format: {
        comments: /^!/
      }
    },
    
    // Output directory
    outDir: 'dist',
    
    // Clear output directory before build
    emptyOutDir: true,
    
    // Generate manifest
    manifest: true
  },
  
  // Development server options
  server: {
    port: 3000,
    open: false
  },
  
  // Preview server options
  preview: {
    port: 4173
  },
  
  // Define environment variables
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  }
});