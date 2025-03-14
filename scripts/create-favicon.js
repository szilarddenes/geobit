const fs = require('fs');
const path = require('path');
const svg2ico = require('svg2ico');

async function createFavicon() {
    try {
        const svgPath = path.resolve(__dirname, '../public/favicon.svg');
        const icoPath = path.resolve(__dirname, '../public/favicon.ico');

        const svgBuffer = fs.readFileSync(svgPath);
        const pngBuffers = await svg2ico(svgBuffer, { sizes: [16, 32, 48] });

        fs.writeFileSync(icoPath, pngBuffers);
        console.log('Successfully created favicon.ico');
    } catch (error) {
        console.error('Error creating favicon.ico:', error);
    }
}

createFavicon(); 