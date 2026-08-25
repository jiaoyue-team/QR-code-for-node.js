const { Jimp } = require('jimp');
const path = require('path');

async function resizeIcon() {
  try {
    const iconPath = path.join(__dirname, 'icons', 'icon-128x128.png');
    const outPath = path.join(__dirname, 'icons', 'icon-256x256.png');
    
    const image = await Jimp.read(iconPath);
    // Resize image using the default algorithm
    image.resize({ w: 256, h: 256 });
    await image.write(outPath);
    
    console.log('Successfully created icon-256x256.png');
  } catch (err) {
    console.error('Failed to resize icon:', err);
  }
}

resizeIcon();
