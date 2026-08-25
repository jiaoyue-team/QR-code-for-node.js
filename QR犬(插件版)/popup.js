document.addEventListener('DOMContentLoaded', () => {
    const qrcodeElement = document.getElementById('qrcode');
    const loadingElement = document.getElementById('loading');
    const urlInput = document.getElementById('url-input');
    const transparentBgCheckbox = document.getElementById('transparent-bg');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');

    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // If we are in an environment without chrome.tabs (e.g., direct HTML open), fallback
        if (!tabs || tabs.length === 0) {
            handleUrl("https://example.com");
            return;
        }
        
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        handleUrl(currentUrl);
    });

    function handleUrl(url) {
        // Set the URL input value
        urlInput.value = url;
        generateQR(url);
    }

    function generateQR(url) {
        qrcodeElement.classList.remove('loaded');
        loadingElement.style.display = 'block';

        // Using setTimeout to allow the UI to render the loading state first
        setTimeout(() => {
            // Clear any existing content
            qrcodeElement.innerHTML = '';
            
            const isTransparent = transparentBgCheckbox.checked;

            // Create QR code
            new QRCode(qrcodeElement, {
                text: url,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: isTransparent ? "rgba(255,255,255,0)" : "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Hide loading, show QR code
            loadingElement.style.display = 'none';
            qrcodeElement.classList.add('loaded');
        }, 100);
    }

    transparentBgCheckbox.addEventListener('change', () => {
        generateQR(urlInput.value);
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', () => {
        urlInput.select();
        document.execCommand('copy');
        
        // Show toast
        toast.classList.add('show');
        
        // Change icon temporarily
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        copyBtn.style.color = '#10b981';

        setTimeout(() => {
            toast.classList.remove('show');
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.color = '';
            // deselect
            window.getSelection().removeAllRanges();
        }, 2000);
    });

    // Download QR Code functionality
    downloadBtn.addEventListener('click', () => {
        const canvas = qrcodeElement.querySelector('canvas');
        const img = qrcodeElement.querySelector('img');
        
        let imgUrl;
        if (canvas) {
            imgUrl = canvas.toDataURL("image/png");
        } else if (img) {
            imgUrl = img.src;
        }

        if (imgUrl) {
            const a = document.createElement('a');
            a.href = imgUrl;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Show toast
            const originalText = toast.textContent;
            toast.textContent = '已開始下載！';
            toast.classList.add('show');
            
            const originalHTML = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            downloadBtn.style.color = '#10b981';

            setTimeout(() => {
                toast.classList.remove('show');
                downloadBtn.innerHTML = originalHTML;
                downloadBtn.style.color = '';
                setTimeout(() => {
                    toast.textContent = originalText;
                }, 300);
            }, 2000);
        }
    });
});
