#!/usr/bin/env node

/**
 * Script para generar iconos y assets PWA placeholder (ES Module)
 * Ejecutar: node generate-assets.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Crear directorio si no existe
const assetsDir = path.join(__dirname, "public", "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log(`✓ Created ${assetsDir}`);
}

// Función para generar SVG placeholder
const createPlaceholder = (width, height, label = "") => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e25822;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)" />
  <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/3}" fill="#ffffff" opacity="0.3" />
  <text x="${width/2}" y="${height/2 + 20}" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${label}</text>
</svg>`;
  return svg;
};

// Crear iconos
const sizes = [
  { size: 192, label: "192" },
  { size: 256, label: "256" },
  { size: 512, label: "512" }
];

sizes.forEach(({ size, label }) => {
  // Regular icon
  const svg = createPlaceholder(size, size, "🚀");
  const filename = path.join(assetsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Generated ${filename}`);

  // Maskable icon
  const maskableSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#e25822" />
  <text x="${size/2}" y="${size/2 + 30}" font-family="Arial" font-size="60" font-weight="bold" fill="white" text-anchor="middle">🚀</text>
</svg>`;
  
  const maskableFilename = path.join(assetsDir, `icon-maskable-${size}x${size}.svg`);
  fs.writeFileSync(maskableFilename, maskableSvg);
  console.log(`✓ Generated ${maskableFilename}`);
});

// Screenshots
const screenshotSizes = [
  { width: 192, height: 192, name: "screenshot-1-192x192.svg" },
  { width: 512, height: 512, name: "screenshot-1-512x512.svg" },
  { width: 1280, height: 720, name: "screenshot-wide-1280x720.svg" }
];

screenshotSizes.forEach(({ width, height, name }) => {
  const svg = createPlaceholder(width, height, "Ares Explorer");
  const filename = path.join(assetsDir, name);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Generated ${filename}`);
});

// Shortcut icon
const shortcutSvg = createPlaceholder(192, 192, "🗺️");
fs.writeFileSync(path.join(assetsDir, "icon-shortcut-192x192.svg"), shortcutSvg);
console.log(`✓ Generated icon-shortcut-192x192.svg`);

// OG image
const ogSvg = createPlaceholder(1200, 630, "Ares Explorer: Mars 2084");
fs.writeFileSync(path.join(assetsDir, "og-image.svg"), ogSvg);
console.log(`✓ Generated og-image.svg`);

console.log("\n✅ Assets generados correctamente en /public/assets/");
console.log("\n📝 Para producción:");
console.log("   - Usa https://www.pwa-asset-generator.com/ para PNG de alta calidad");
console.log("   - Sube diseños finales a /public/assets/");
console.log("\n🚀 Next: Despliega en Vercel y sube a Google Play Console");
