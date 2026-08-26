# QR狗 (QR Dog) - 手機版 QR Code 生成與掃描器 🐶📱

一個現代化、功能全面且支援離線運作的 Android QR Code 應用程式。

---

## ✨ 核心功能特色

### 1. 多類型 QR Code 即時生成
* 🌐 **網址 / 純文字**：支援任何文字與超連結
* 📶 **Wi-Fi 連線**：掃描後手機可直接連上 Wi-Fi（支援 WPA/WPA2/WPA3/WEP/隱藏SSID）
* 👤 **聯絡人名片 (vCard)**：支援姓名、電話、電子郵件、公司與職稱
* 📞 **電話號碼**：一鍵撥號
* 💬 **簡訊 (SMS)**：預設收件號碼與簡訊文字
* ✉️ **電子郵件**：預設收件信箱、主旨與內文
* 📍 **地圖座標**：經緯度定位

### 2. 進階外觀自訂工作坊
* 🎨 **顏色客製**：支援自選前景色、背景色及多組熱門配色方案
* 🔲 **碼點樣式**：圓潤 (Rounded)、圓點 (Dots)、經典方形、特圓 (Extra)、優雅 (Classy) 等
* 🔳 **定位角樣式**：圓角、圓點、經典方角
* 🖼️ **中心 Logo**：支援上傳相簿圖片或商標嵌入 QR Code 中央

### 3. 便捷分享與匯出
* 💾 **一鍵儲存**：高畫質 PNG 圖片下載到相簿
* 📤 **原生分享**：調用 Android 系統分享選單至 LINE、社群軟體等
* 📋 **複製功能**：一鍵複製內容文字或圖片

### 4. 歷史紀錄管理
* 自動儲存生成過的 QR Code，可隨時重新載入或匯出

---

## 🚀 如何快速測試與預覽

雙擊執行專案目錄下的 **`run-dev.bat`**，即可在電腦瀏覽器預覽，或手機連接相同 Wi-Fi 輸入顯示的網址測試。

---

## 📦 如何輸出 Android APK

### 方法 A：使用 Android Studio（最推薦）
1. 雙擊執行 **`build-apk.bat`**（會自動打包前端並開啟 Android Studio）。
2. 在 Android Studio 上方選單點選：
   `Build` ➔ `Build Bundle(s) / APK(s)` ➔ `Build APK(s)`
3. 編譯完成後，右下角會跳出通知提示 `locate`，點擊即可取得 **`app-debug.apk`**！

### 方法 B：命令列編譯
如果您的電腦已配置 Android SDK 環境變數，可以在專案目錄執行：
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
產出的 APK 會位於：
`android/app/build/outputs/apk/debug/app-debug.apk`
