# ⬡ QR 狗 (QR-code-for-node.js)

> 🎨 美觀、強大且高客製化的 QR Code 生成工具套件。包含 **Electron 桌面應用程式** 與 **Chromium 瀏覽器擴充外掛** 兩種版本。

---

## 📖 專案簡介

**QR 狗** 致力於提供現代化、直覺且具備高自訂性的 QR Code 生成體驗。
本專案包含兩個獨立運行的版本：
1. **QR 狗 (桌面版)**：基於 Electron 開發，支援自訂顏色、樣式形狀、圖片遮罩、高解析度多格式下載。
2. **QR 犬 (插件版)**：基於 Chrome Extension Manifest V3 開發，一鍵將當前分頁轉換為 QR Code。

---

## 💻 專案環境需求

| 工具 / 環境 | 建議版本 | 說明 |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` (LTS 推薦) | 執行桌面版主進程與執行打包構建 |
| **npm** | `>= 9.0.0` (隨 Node.js 附帶) | 套件管理與腳本執行 |
| **瀏覽器** | Chrome / Edge / Brave (Chromium 核心) | 執行與載入瀏覽器擴充功能 |
| **作業系統** | Windows 10 / 11 (64-bit) | 桌面端最佳支援環境 |

---

## 🚀 本地運行指引 (Local Run)

| 模組名稱 | 所在路徑 | 運行方式 / 指令 | 說明 |
| :--- | :--- | :--- | :--- |
| **桌面版 (智慧啟動)** | `windows/` | `npm start` | 自動檢查 `node_modules`，若未安裝會**自動執行 `npm install`** 並啟動應用 |
| **桌面版 (開發模式)** | `windows/` | `npm run dev` | 直接透過本機安裝的 `electron` 啟動應用程式視窗 |
| **瀏覽器擴充功能** | `QR犬(插件版)/` | `chrome://extensions/` 載入未封裝項目 | 於 Chrome / Edge 開啟「開發人員模式」，點擊「載入未封裝項目」選取該資料夾 |

---

## 📦 使用套件與插件清單 (Dependencies & Plugins)

### 🖥️ 1. 桌面應用程式 (`windows/`)

| 套件 / 插件名稱 | 版本 | 類型 | 用途說明 |
| :--- | :--- | :--- | :--- |
| [**electron**](https://www.electronjs.org/) | `^35.0.0` | `devDependencies` | 跨平台桌面應用程式框架與運行環境 |
| [**electron-builder**](https://www.electron.build/) | `^24.13.3` | `devDependencies` | 桌面端應用程式編譯、打包與安裝程式建置工具 |
| [**qrcode**](https://www.npmjs.com/package/qrcode) | `^1.5.4` | `dependencies` | QR Code 矩陣計算核心（計算資料點陣、支援容錯層級設定） |
| [**@simonwep/pickr**](https://github.com/simonwep/pickr) | `^1.10.1` | `dependencies` | 前端精緻色彩選取器（採用 Nano 主題，支援 HEXA/RGBA 即時切換） |
| [**jimp**](https://github.com/jimp-dev/jimp) | `^1.6.1` | `dependencies` | JavaScript 影像處理函式庫（圖片縮放、轉換輔助） |

### 🌐 2. 瀏覽器擴充功能 (`QR犬(插件版)/`)

| 插件 / 資源名稱 | 來源 / 規範 | 類型 | 用途說明 |
| :--- | :--- | :--- | :--- |
| **Chrome Extension Manifest V3** | Google Chrome 規範 | 核心架構 | 現代化瀏覽器擴充功能標準（具備 `activeTab` 權限） |
| **qrcode.min.js** | 本地靜態函式庫 | 前端渲染 | 輕量級客戶端 QR Code 快速繪製函式庫 |
| **Inter Font** | Google Fonts | Web 字型 | 擴充功能 UI 現代化無襯線字型 |

---

## 🔨 編譯與打包指南 (Build & Compilation)

所有編譯指令均在 `windows/` 目錄下執行：

```bash
cd windows
```

| 編譯目標 | 執行指令 | 輸出產物 | 輸出目錄 | 說明 |
| :--- | :--- | :--- | :--- | :--- |
| **Windows 安裝檔** | `npm run build` | `QR 狗 Setup 1.5.2.exe` | `windows/dist/` | 產生 NSIS 完整安裝檔，支援自訂安裝路徑、建立桌面與開始功能表捷徑 |
| **Windows 免安裝版** | `npm run build:portable` | `QR 狗-Portable.exe` | `windows/dist/` | 產生單一可執行檔 (Portable)，點擊即開、免安裝 |

> 💡 **打包設定細節**：打包配置定義於 `windows/package.json` 中的 `build` 欄位，已預設配置圖示（`icons/icon-256x256.png`）與應用程式識別碼（`com.qrcode.generator`）。

---

## ✨ 核心特色對照

| 功能項目 | 桌面應用程式版 (`windows/`) | 瀏覽器擴充外掛版 (`QR犬(插件版)/`) |
| :--- | :---: | :---: |
| **一鍵取得當前分頁網址** | ❌ (手動輸入/貼上) |  (自動讀取當前標籤頁) |
| **碼點樣式自訂** |  (方形 / 圓形 / 圓角 / 液體融合) | ❌ (標準方形) |
| **定位角 (Eyes) 樣式** |  (方形 / 圓形 / 全圓角 / 葉片狀) | ❌ (標準樣式) |
| **自訂顏色 & 主題** |  (內建 4 種主題 + Pickr 全彩調色盤) | ❌ (黑白對比) |
| **圖片遮罩 (Image Mask)** |  (支援上傳圖片作為 QR 紋理) | ❌ |
| **背景透明化** |  (支援開關) |  (支援開關) |
| **自訂下載解析度** |  (400 / 800 / 1200 / 200~4000 自訂) | 固定解析度 |
| **匯出檔案格式** | `PNG` / `JPG` / `WEBP` | `PNG` |
| **安全對比度 / 尺寸防呆警告** |  (即時警示) | ❌ |
| **一鍵複製網址** | ❌ |  |

---

## 📁 專案目錄結構

```plaintext
QR-code-for-node.js/
├── README.md
│
├── QR犬(插件版)/              # Chrome / Edge 瀏覽器擴充功能
│   ├── icons/                 # 擴充外掛圖示 (16x16, 32x32, 48x48, 128x128)
│   ├── manifest.json          # 擴充功能設定檔 (Manifest V3)
│   ├── popup.html             # 彈出視窗 HTML
│   ├── popup.css              # 介面樣式
│   ├── popup.js               # 擴充功能前端邏輯 (自動抓網址、複製、下載)
│   └── qrcode.min.js          # QR Code 生成函式庫
│
└── windows/                   # Electron 桌面應用程式
    ├── index.html             # 桌面端主畫面 (控制面板 + 即時預覽)
    ├── styles.css             # 現代霓虹暗色系 UI 樣式
    ├── renderer.js            # 畫布渲染、樣式繪製、色彩與防呆邏輯
    ├── main.js                # Electron 主進程 (視窗管理、IPC 通訊、檔案儲存)
    ├── preload.js             # ContextBridge 安全橋接
    ├── launcher.js            # 智慧啟動器 (自動檢查/安裝依賴並啟動)
    └── package.json           # 專案依賴與 Electron Builder 打包設定
```

---

## 📝 授權條款

本專案採用 [MIT License](https://opensource.org/licenses/MIT) 授權開源。

