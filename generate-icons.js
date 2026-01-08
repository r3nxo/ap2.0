const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createSVGIcon(size) {
  const radius = size * 0.2;
  const fontSize = size * 0.35;
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00F5FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFB800;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#gradient)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#0A0E27" text-anchor="middle" dominant-baseline="central">LP</text>
</svg>`;

  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✅ Created: icon-${size}x${size}.svg`);
}

console.log('🎨 Generating PWA icons...\n');
sizes.forEach(createSVGIcon);
console.log('\n✨ All SVG icons generated successfully!');
console.log('\n📝 Note: For production, convert SVG to PNG using:');
console.log('   - Online tools like https://cloudconvert.com/svg-to-png');
console.log('   - Or ImageMagick: convert icon.svg icon.png');
console.log('\nFor now, rename .svg to .png in manifest.json or use online converter.\n');
