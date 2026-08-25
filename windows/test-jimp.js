const { Jimp } = require('jimp');

async function testMask() {
  const mask = new Jimp({ width: 100, height: 100, color: '#000000ff' }); // Black mask
  const image = new Jimp({ width: 100, height: 100, color: '#ff0000ff' }); // Red image

  // Mask
  image.mask(mask, 0, 0);

  // Background
  const bg = new Jimp({ width: 100, height: 100, color: '#00ff00ff' }); // Green bg
  bg.composite(image, 0, 0);

  // Output
  const b64 = await bg.getBase64('image/png');
  console.log('Success, length:', b64.length);
}

testMask().catch(console.error);
