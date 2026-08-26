# ⬡ QR 狗 (QR-code-for-node.js)

> 🎨 美觀、強大且高客製化的跨平台 QR Code 生成工具套件。包含 **Windows 桌面端**、**Android 手機 App** 與 **Chromium 瀏覽器擴充外掛** 三種版本。

---

## 📖 專案簡介

**QR 狗** 致力於提供現代化、直覺且具備高自訂性的 QR Code 全方位生成解決方案。
本專案包含三個獨立運行的平台版本：

1. 🖥️ **QR 狗 (Windows 桌面版)**：基於 Electron 開發，支援豐富碼點與定位角樣式、自訂色彩主題、圖片紋理遮罩與高解析度多格式輸出。
2. 📱 **QR 狗 (Android 手機版)**：基於 Vue 3 + Capacitor 6 開發，支援 7 種常用資料類型快速生成（Wi-Fi、名片、地圖等）、中央 Logo 嵌入、透明背景、歷史紀錄與原生系統分享，**完全離線且無須相機權限**。
3. 🌐 **QR 犬 (瀏覽器插件版)**：基於 Chrome Extension Manifest V3 開發，一鍵將當前分頁轉換為 QR Code，即掃即開。

---

## 💻 專案環境需求

| 工具 / 環境 | 建議版本 | 適用端 | 說明 |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` (LTS 推薦) | 全部 | 執行桌面版主進程、Vue 前端構建與腳本運行 |
| **npm** | `>= 9.0.0` (隨 Node.js 附帶) | 全部 | 依賴套件管理與命令執行 |
| **JDK (Java)** | 17 或 21 (Android Studio 內建 jbr) | Android 端 | Android 原生 Gradle APK 編譯必要環境 |
| **Android SDK / Studio** | Android Studio Ladybug / Koala+ | Android 端 | Android 原生專案開啟、除錯與打包 |
| **瀏覽器** | Chrome / Edge / Brave (Chromium 核心) | 擴充外掛 / Web | 載入外掛或本地 Web 開發預覽 |
| **作業系統** | Windows 10 / 11 (64-bit) | 桌面端 | 桌面版與 APK 編譯最佳環境 |

---

## 🚀 本地運行指引 (Local Run)

| 模組名稱 | 所在路徑 | 運行方式 / 指令 | 說明 |
| :--- | :--- | :--- | :--- |
| **桌面版 (智慧啟動)** | `windows/` | `npm start` | 自動檢查 `node_modules`，若未安裝會**自動執行 `npm install`** 並啟動應用 |
| **桌面版 (開發模式)** | `windows/` | `npm run dev` | 直接以 Electron 開發模式啟動視窗 |
| **Android (瀏覽器預覽)** | `Android/` | 雙擊 `run-dev.bat` 或 `npm run dev` | 啟動 Vite 本地伺服器，可在電腦瀏覽器或區域網路內用手機預覽 |
| **Android (開啟原生專案)** | `Android/` | 雙擊 `build-apk.bat` 或 `npm run cap:open` | 編譯前端並自動喚起 Android Studio 進行真機除錯 |
| **瀏覽器擴充功能** | `QR犬(插件版)/` | `chrome://extensions/` 載入未封裝項目 | 開啟「開發人員模式」，點擊「載入未封裝項目」選取該資料夾 |

---

## 📦 使用套件與插件清單 (Dependencies & Plugins)

### 🖥️ 1. Windows 桌面端 (`windows/`)

| 套件 / 插件名稱 | 版本 | 類型 | 用途說明 |
| :--- | :--- | :--- | :--- |
| [**electron**](https://www.electronjs.org/) | `^35.0.0` | `devDependencies` | 跨平台桌面應用程式框架與運行環境 |
| [**electron-builder**](https://www.electron.build/) | `^24.13.3` | `devDependencies` | 桌面端應用程式編譯、打包與安裝程式建置工具 |
| [**qrcode**](https://www.npmjs.com/package/qrcode) | `^1.5.4` | `dependencies` | QR Code 矩陣計算核心（計算資料點陣、支援容錯層級設定） |
| [**@simonwep/pickr**](https://github.com/simonwep/pickr) | `^1.10.1` | `dependencies` | 前端精緻色彩選取器（採用 Nano 主題，支援 HEXA/RGBA 即時切換） |
| [**jimp**](https://github.com/jimp-dev/jimp) | `^1.6.1` | `dependencies` | JavaScript 影像處理函式庫（圖片縮放、轉換輔助） |

---

### 📱 2. Android 手機端 (`Android/`)

| 套件 / 插件名稱 | 版本 | 類型 | 用途說明 |
| :--- | :--- | :--- | :--- |
| [**vue**](https://vuejs.org/) | `^3.5.10` | `dependencies` | 核心前端框架（Composition API、響應式介面） |
| [**@capacitor/core**](https://capacitorjs.com/) | `^6.1.2` | `dependencies` | 跨平台 Native Runtime 橋接核心 |
| [**@capacitor/android**](https://capacitorjs.com/) | `^6.1.2` | `dependencies` | Capacitor Android 原生專案容器 |
| [**@capacitor/filesystem**](https://capacitorjs.com/docs/apis/filesystem) | `^6.0.1` | `dependencies` | 原生檔案系統存取（將 QR Code 圖片儲存至相簿/儲存空間） |
| [**@capacitor/share**](https://capacitorjs.com/docs/apis/share) | `^6.0.2` | `dependencies` | 調用 Android 系統原生分享選單 (LINE、社群軟體等) |
| [**@capacitor/toast**](https://capacitorjs.com/docs/apis/toast) | `^6.0.2` | `dependencies` | 原生浮動訊息提示 (Toast) |
| [**qr-code-styling**](https://qr-code-styling.com/) | `^1.6.0-rc.1` | `dependencies` | 高度客製化 QR Code 渲染引擎（碼點、角點樣式與 Logo 嵌入） |
| [**lucide-vue-next**](https://lucide.dev/) | `^0.446.0` | `dependencies` | 現代美觀圖示庫 |
| [**tailwindcss**](https://tailwindcss.com/) | `^3.4.13` | `devDependencies` | 原子化 CSS 樣式框架 |
| [**vite**](https://vitejs.dev/) | `^5.4.8` | `devDependencies` | 極速前端構建與開發工具 |

---

### 🌐 3. 瀏覽器擴充功能 (`QR犬(插件版)/`)

| 插件 / 資源名稱 | 來源 / 規範 | 類型 | 用途說明 |
| :--- | :--- | :--- | :--- |
| **Chrome Extension Manifest V3** | Google Chrome 規範 | 核心架構 | 現代化瀏覽器擴充功能標準（具備 `activeTab` 權限） |
| **qrcode.min.js** | 本地靜態函式庫 | 前端渲染 | 輕量級客戶端 QR Code 快速繪製函式庫 |
| **Inter Font** | Google Fonts | Web 字型 | 擴充功能 UI 現代化無襯線字型 |

---

## 🔨 編譯與打包指南 (Build & Compilation)

### 🖥️ Windows 桌面端打包

切換至 `windows/` 目錄執行：
```bash
cd windows
```

| 編譯目標 | 執行指令 | 輸出產物 | 輸出目錄 | 說明 |
| :--- | :--- | :--- | :--- | :--- |
| **Windows 安裝檔** | `npm run build` | `QR 狗 Setup 1.5.2.exe` | `windows/dist/` | 產生 NSIS 完整安裝檔，支援自訂路徑與桌面捷徑 |
| **Windows 免安裝版** | `npm run build:portable` | `QR 狗-Portable.exe` | `windows/dist/` | 產生單一可執行檔 (Portable)，點擊即開、免安裝 |

---

### 📱 Android APK 編譯打包

切換至 `Android/` 目錄：
```bash
cd Android
```

| 編譯方式 | 執行指令 / 動作 | 輸出產物 | 說明 |
| :--- | :--- | :--- | :--- |
| ⚡ **一鍵自動編譯 (推薦)** | 雙擊 `1鍵產出APK.bat` | `Android/QR狗-最新版.apk` | 自動執行 Vite 前端構建、同步資源至原生專案並呼叫 Gradle 編譯出 Debug APK |
| 🛠️ **Android Studio** | 雙擊 `build-apk.bat`<br>➔ `Build` ➔ `Build APK(s)` | `android/app/build/outputs/apk/debug/app-debug.apk` | 自動同步並喚起 Android Studio，適合需要設定簽署或真機除錯 |
| 💻 **命令列 Gradle 編譯** | `npm run build`<br>`npx cap sync android`<br>`cd android && ./gradlew assembleDebug` | `android/app/build/outputs/apk/debug/app-debug.apk` | 適用於 CI/CD 自動化流程或已配置 Android SDK 之終端機 |

---

## ✨ 核心特色全平台對照表

| 功能項目 | 🖥️ Windows 桌面版 | 📱 Android 手機版 | 🌐 瀏覽器插件版 |
| :--- | :---: | :---: | :---: |
| **基本網址 / 文字生成** |  |  |  |
| **專用類型生成 (Wi-Fi / 名片 / 簡訊 / 電話 / Email / 地圖)** | ❌ (手動編碼) |  (7 種專屬表單輸入) | ❌ |
| **一鍵取得當前網頁網址** | ❌ (手動輸入) | ❌ |  (自動讀取 activeTab) |
| **碼點樣式自訂** |  (4 種樣式) |  (圓潤/圓點/經典/特圓/優雅) | ❌ (標準方形) |
| **定位角 (Eyes) 樣式** |  (4 種樣式) |  (圓角/圓點/經典方角) | ❌ (標準樣式) |
| **自訂調色盤 & 主題** |  (4 款主題 + Pickr) |  (多組主題 + 色彩自訂) | ❌ (黑白) |
| **圖片 / 商標 (Logo) 嵌入** |  (紋理遮罩) |  (中央嵌入 Logo 商標) | ❌ |
| **背景透明化** |  |  |  |
| **原生系統分享 / 複製** | ❌ |  (呼叫系統分享/存相簿) |  (一鍵複製網址) |
| **生成歷史紀錄管理** | ❌ |  (本地持久化儲存) | ❌ |
| **隱私安全保護** |  (無連網外傳) |  (**完全離線、無須相機權限**) |  |
| **自訂輸出解析度** |  (400~4000 px) | 固定高解析度 | 固定解析度 |
| **支援匯出格式** | `PNG` / `JPG` / `WEBP` | `PNG` | `PNG` |

---

## 📁 專案目錄結構

```plaintext
QR-code-for-node.js/
├── README.md
│
├── Android/                   # Android 手機版 (Vue 3 + Capacitor 6)
│   ├── android/               # Android 原生專案目錄 (Gradle, Android Studio 專案)
│   ├── src/                   # 前端原始碼 (App.vue, main.js, style.css)
│   ├── public/                # 靜態資源
│   ├── 1鍵產出APK.bat          # 一鍵自動編譯出 APK 檔案
│   ├── build-apk.bat          # 自動構建並喚起 Android Studio
│   ├── run-dev.bat            # 啟動本地開發伺服器
│   ├── capacitor.config.json  # Capacitor 跨平台設定檔
│   ├── vite.config.js         # Vite 構建配置
│   ├── tailwind.config.js     # Tailwind CSS 配置
│   └── package.json           # 手機版前端與原生插件依賴
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



