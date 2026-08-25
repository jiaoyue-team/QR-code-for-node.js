(() => {
  const urlInput = document.getElementById('url-input');
  const transparentToggle = document.getElementById('transparent-toggle');
  const formatSelect = document.getElementById('format-select');
  const bgColorHex = document.getElementById('bg-color-hex');
  const bgColorRow = document.getElementById('bg-color-row');
  const qrColorHex = document.getElementById('qr-color-hex');
  const qrPreview = document.getElementById('qr-preview');
  const qrImage = document.getElementById('qr-image');
  const qrPlaceholder = document.getElementById('qr-placeholder');
  const downloadBtn = document.getElementById('download-btn');
  const statusEl = document.getElementById('status');
  const transparentHint = document.getElementById('transparent-hint');
  const colorWarning = document.getElementById('color-warning');
  const qrCanvas = document.getElementById('qr-canvas');

  // Logo elements
  const logoUpload = document.getElementById('logo-upload');
  const logoClearBtn = document.getElementById('logo-clear');
  const logoFilename = document.getElementById('logo-filename');
  const logoHint = document.getElementById('logo-hint');
  const imageWarning = document.getElementById('image-warning');

  // Size & Style elements
  const sizeSelect = document.getElementById('size-select');
  const customSizeInput = document.getElementById('custom-size-input');
  const sizeWarning = document.getElementById('size-warning');
  
  const themeSelect = document.getElementById('theme-select');
  const dotsStyleSelect = document.getElementById('dots-style-select');
  const cornersStyleSelect = document.getElementById('corners-style-select');

  let debounceTimer = null;
  let currentUrl = '';
  let logoDataUrl = null;

  // ─── Themes ───
  const themes = {
    default: { bg: '#1a1a2e', qr: '#ffffff' },
    cyberpunk: { bg: '#2b0f4c', qr: '#00f0ff' },
    sunset: { bg: '#2d0a31', qr: '#ff7b00' },
    ocean: { bg: '#011c2b', qr: '#00ffa2' }
  };

  // ─── Color helpers ───
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function colorDistance(hex1, hex2) {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    if (!c1 || !c2) return 999;
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function areColorsTooClose(bgHex, qrHex) {
    return colorDistance(bgHex, qrHex) < 80;
  }

  // ─── Get current options ───
  function getOptions() {
    let size = 800;
    if (sizeSelect.value === 'custom') {
      const customVal = parseInt(customSizeInput.value, 10);
      if (!isNaN(customVal)) size = customVal;
    } else {
      size = parseInt(sizeSelect.value, 10);
    }

    return {
      text: urlInput.value.trim(),
      transparent: transparentToggle.checked,
      format: formatSelect.value,
      bgColor: transparentToggle.checked ? null : (window.pickrBg ? window.pickrBg.getColor().toHEXA().toString() : '#1a1a2e'),
      qrColor: window.pickrQr ? window.pickrQr.getColor().toHEXA().toString() : '#ffffff',
      logoDataUrl: logoDataUrl,
      size: size,
      dotsStyle: dotsStyleSelect.value,
      cornersStyle: cornersStyleSelect.value
    };
  }

  // ─── Canvas Render Engine ───
  async function drawQRToCanvas(canvas, sizePx, opts) {
    const matrixResult = await window.qrAPI.getQRMatrix({ 
      text: opts.text, 
      errorCorrectionLevel: opts.logoDataUrl ? 'H' : 'M' 
    });
    
    if (!matrixResult.success) throw new Error(matrixResult.error);
    
    const mSize = matrixResult.size;
    const mData = matrixResult.data;
    
    canvas.width = sizePx;
    canvas.height = sizePx;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Foreground temporary canvas for shapes & masking
    const fgCanvas = document.createElement('canvas');
    fgCanvas.width = sizePx;
    fgCanvas.height = sizePx;
    const fgCtx = fgCanvas.getContext('2d');
    
    const paddingModules = 2;
    const totalModules = mSize + paddingModules * 2;
    const cellSize = sizePx / totalModules;
    const offset = paddingModules * cellSize;
    
    const isDark = (x, y) => (x >= 0 && x < mSize && y >= 0 && y < mSize && mData[y * mSize + x] === 1);
    const isEye = (x, y) => (x < 7 && y < 7) || (x >= mSize - 7 && y < 7) || (x < 7 && y >= mSize - 7);
    
    fgCtx.fillStyle = opts.qrColor || '#ffffff';
    
    // 1. Draw modules
    for (let y = 0; y < mSize; y++) {
      for (let x = 0; x < mSize; x++) {
        if (!isDark(x, y) || isEye(x, y)) continue;
        
        const px = offset + x * cellSize;
        const py = offset + y * cellSize;
        
        if (opts.dotsStyle === 'dots') {
          fgCtx.beginPath();
          fgCtx.arc(px + cellSize/2, py + cellSize/2, cellSize/2 * 0.85, 0, Math.PI * 2);
          fgCtx.fill();
        } else if (opts.dotsStyle === 'rounded') {
          fgCtx.beginPath();
          fgCtx.roundRect(px + cellSize*0.1, py + cellSize*0.1, cellSize*0.8, cellSize*0.8, cellSize*0.3);
          fgCtx.fill();
        } else if (opts.dotsStyle === 'classy') {
          const hasTop = isDark(x, y-1) && !isEye(x, y-1);
          const hasBottom = isDark(x, y+1) && !isEye(x, y+1);
          const hasLeft = isDark(x-1, y) && !isEye(x-1, y);
          const hasRight = isDark(x+1, y) && !isEye(x+1, y);
          fgCtx.beginPath();
          fgCtx.arc(px + cellSize/2, py + cellSize/2, cellSize/2, 0, Math.PI * 2);
          fgCtx.fill();
          if (hasRight) fgCtx.fillRect(px + cellSize/2, py, cellSize/2 + 0.5, cellSize);
          if (hasBottom) fgCtx.fillRect(px, py + cellSize/2, cellSize, cellSize/2 + 0.5);
          if (hasTop) fgCtx.fillRect(px, py, cellSize, cellSize/2 + 0.5);
          if (hasLeft) fgCtx.fillRect(px, py, cellSize/2 + 0.5, cellSize);
        } else {
          // square
          fgCtx.fillRect(px, py, cellSize + 0.5, cellSize + 0.5);
        }
      }
    }
    
    // 2. Draw Eyes
    const drawEye = (ex, ey) => {
      const px = offset + ex * cellSize;
      const py = offset + ey * cellSize;
      const eyeSize = 7 * cellSize;
      const innerSize = 3 * cellSize;
      const innerOffset = 2 * cellSize;
      
      if (opts.cornersStyle === 'dot') {
        fgCtx.beginPath();
        fgCtx.arc(px + eyeSize/2, py + eyeSize/2, eyeSize/2, 0, Math.PI * 2);
        fgCtx.arc(px + eyeSize/2, py + eyeSize/2, eyeSize/2 - cellSize, 0, Math.PI * 2, true);
        fgCtx.fill();
        fgCtx.beginPath();
        fgCtx.arc(px + eyeSize/2, py + eyeSize/2, innerSize/2, 0, Math.PI * 2);
        fgCtx.fill();
      } else if (opts.cornersStyle === 'extra-rounded') {
        fgCtx.beginPath();
        fgCtx.roundRect(px, py, eyeSize, eyeSize, eyeSize*0.25);
        fgCtx.roundRect(px + cellSize, py + cellSize, eyeSize - 2*cellSize, eyeSize - 2*cellSize, (eyeSize - 2*cellSize)*0.25);
        fgCtx.fill('evenodd');
        fgCtx.beginPath();
        fgCtx.roundRect(px + innerOffset, py + innerOffset, innerSize, innerSize, innerSize*0.25);
        fgCtx.fill();
      } else if (opts.cornersStyle === 'leaf') {
         fgCtx.beginPath();
         fgCtx.roundRect(px, py, eyeSize, eyeSize, [eyeSize/2, 0, eyeSize/2, 0]);
         fgCtx.roundRect(px + cellSize, py + cellSize, eyeSize - 2*cellSize, eyeSize - 2*cellSize, [(eyeSize - 2*cellSize)/2, 0, (eyeSize - 2*cellSize)/2, 0]);
         fgCtx.fill('evenodd');
         fgCtx.beginPath();
         fgCtx.roundRect(px + innerOffset, py + innerOffset, innerSize, innerSize, [innerSize/2, 0, innerSize/2, 0]);
         fgCtx.fill();
      } else {
        // square
        fgCtx.fillRect(px, py, eyeSize, cellSize);
        fgCtx.fillRect(px, py + eyeSize - cellSize, eyeSize, cellSize);
        fgCtx.fillRect(px, py, cellSize, eyeSize);
        fgCtx.fillRect(px + eyeSize - cellSize, py, cellSize, eyeSize);
        fgCtx.fillRect(px + innerOffset, py + innerOffset, innerSize, innerSize);
      }
    };
    
    drawEye(0, 0); 
    drawEye(mSize - 7, 0); 
    drawEye(0, mSize - 7);
    
    // 3. Mask Image (if any)
    if (opts.logoDataUrl) {
      const img = new Image();
      img.src = opts.logoDataUrl;
      await new Promise(r => { img.onload = r; img.onerror = r; });
      fgCtx.globalCompositeOperation = 'source-in';
      fgCtx.drawImage(img, 0, 0, sizePx, sizePx);
      fgCtx.globalCompositeOperation = 'source-over';
    }
    
    // 4. Draw to main canvas
    ctx.clearRect(0, 0, sizePx, sizePx);
    if (!opts.transparent) {
      ctx.fillStyle = opts.bgColor || '#1a1a2e';
      ctx.fillRect(0, 0, sizePx, sizePx);
    }
    ctx.drawImage(fgCanvas, 0, 0);
  }

  // ─── Debounced QR Generation ───
  function scheduleGenerate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(generateQR, 400);
  }

  async function generateQR() {
    const opts = getOptions();

    if (!opts.text) {
      qrImage.style.display = 'none';
      qrPlaceholder.style.display = 'flex';
      qrPreview.classList.remove('has-checkerboard');
      downloadBtn.disabled = true;
      setStatus('');
      currentUrl = '';
      return;
    }

    currentUrl = opts.text;

    try {
      // Draw at 400px for preview
      await drawQRToCanvas(qrCanvas, 400, opts);
      qrImage.src = qrCanvas.toDataURL('image/png');
      qrImage.style.display = 'block';
      qrPlaceholder.style.display = 'none';
      downloadBtn.disabled = false;

      if (opts.transparent) {
        qrPreview.classList.add('has-checkerboard');
      } else {
        qrPreview.classList.remove('has-checkerboard');
      }
      setStatus('');
    } catch (err) {
      setStatus('產生 QR Code 時發生錯誤', 'error');
      console.error(err);
    }
  }

  // ─── Download Handler ───
  async function handleDownload() {
    const opts = getOptions();
    if (!opts.text) return;

    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '⏳';

    try {
      // Draw high resolution to offscreen canvas
      const renderCanvas = document.createElement('canvas');
      await drawQRToCanvas(renderCanvas, opts.size, opts);
      
      const mimeType = opts.format === 'jpg' ? 'image/jpeg' : (opts.format === 'webp' ? 'image/webp' : 'image/png');
      const dataUrl = renderCanvas.toDataURL(mimeType, 0.95);

      const result = await window.qrAPI.saveQR({ dataUrl: dataUrl, format: opts.format });

      if (result.success) {
        setStatus('✓ 已儲存', 'success');
      } else if (result.error === 'cancelled') {
        setStatus('');
      } else {
        setStatus('儲存失敗：' + result.error, 'error');
      }
    } catch (err) {
      setStatus('儲存時發生錯誤', 'error');
      console.error(err);
    }

    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '⬇';
  }

  // ─── Status Display ───
  function setStatus(msg, type = '') {
    statusEl.textContent = msg;
    statusEl.className = 'status ' + type;
  }

  // ─── Update UI state ───
  function updateUI() {
    const isTransparent = transparentToggle.checked;

    if (isTransparent) {
      formatSelect.value = 'png';
      formatSelect.disabled = true;
      bgColorRow.classList.add('hidden');
      transparentHint.textContent = 'ⓘ 透明背景已啟用，強制使用 PNG 格式';
      transparentHint.classList.add('visible');
    } else {
      formatSelect.disabled = false;
      bgColorRow.classList.remove('hidden');
      transparentHint.classList.remove('visible');
    }

    if (!isTransparent && window.pickrBg && window.pickrQr && areColorsTooClose(window.pickrBg.getColor().toHEXA().toString(), window.pickrQr.getColor().toHEXA().toString())) {
      colorWarning.classList.add('visible');
    } else {
      colorWarning.classList.remove('visible');
    }

    if (logoDataUrl) {
      imageWarning.classList.add('visible');
    } else {
      imageWarning.classList.remove('visible');
    }

    let isValidSize = true;
    if (sizeSelect.value === 'custom') {
      customSizeInput.classList.remove('hidden');
      const sizeVal = parseInt(customSizeInput.value, 10);
      if (isNaN(sizeVal) || sizeVal < 200) {
        isValidSize = false;
        sizeWarning.classList.add('visible');
      } else {
        sizeWarning.classList.remove('visible');
      }
    } else {
      customSizeInput.classList.add('hidden');
      sizeWarning.classList.remove('visible');
    }

    downloadBtn.disabled = !currentUrl || !isValidSize;
  }

  // ─── Event Listeners ───
  urlInput.addEventListener('input', scheduleGenerate);

  const changeListeners = [
    transparentToggle, formatSelect, sizeSelect, customSizeInput, 
    dotsStyleSelect, cornersStyleSelect
  ];
  changeListeners.forEach(el => {
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => {
      updateUI();
      if (currentUrl) scheduleGenerate();
    });
  });

  // ─── Pickr Initialization ───
  const pickrOptions = {
    theme: 'nano',
    components: {
      preview: true,
      opacity: false,
      hue: true,
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        save: true
      }
    }
  };

  window.pickrBg = Pickr.create({
    el: '#bg-color-picker',
    default: '#1a1a2e',
    ...pickrOptions
  });

  window.pickrQr = Pickr.create({
    el: '#qr-color-picker',
    default: '#ffffff',
    ...pickrOptions
  });

  window.pickrBg.on('change', (color) => {
    bgColorHex.textContent = color.toHEXA().toString();
    updateUI();
    if (currentUrl) scheduleGenerate();
  }).on('save', () => {
    window.pickrBg.hide();
  });

  window.pickrQr.on('change', (color) => {
    qrColorHex.textContent = color.toHEXA().toString();
    updateUI();
    if (currentUrl) scheduleGenerate();
  }).on('save', () => {
    window.pickrQr.hide();
  });

  themeSelect.addEventListener('change', () => {
    const theme = themes[themeSelect.value];
    if (theme) {
      window.pickrBg.setColor(theme.bg);
      bgColorHex.textContent = theme.bg;
      window.pickrQr.setColor(theme.qr);
      qrColorHex.textContent = theme.qr;
      
      updateUI();
      if (currentUrl) scheduleGenerate();
    }
  });

  downloadBtn.addEventListener('click', handleDownload);

  // Logo upload handling
  logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      logoDataUrl = event.target.result;
      logoFilename.textContent = file.name;
      logoHint.classList.add('visible');
      logoClearBtn.classList.remove('hidden');
      updateUI();
      if (currentUrl) generateQR();
    };
    reader.readAsDataURL(file);
  });

  logoClearBtn.addEventListener('click', () => {
    logoUpload.value = '';
    logoDataUrl = null;
    logoFilename.textContent = '';
    logoHint.classList.remove('visible');
    logoClearBtn.classList.add('hidden');
    updateUI();
    if (currentUrl) generateQR();
  });

  // Initial state
  updateUI();
  urlInput.focus();
})();
