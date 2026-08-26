@echo off
chcp 65001 >nul
echo ==============================================
echo       QR狗 (QR Dog) - Android APK 打包腳本
echo ==============================================
echo.

echo [1/3] 正在編譯前端資源 (Vite Build)...
call npm run build
if %errorlevel% neq 0 (
    echo [錯誤] 前端編譯失敗！
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] 正在同步資源至 Android 原生專案 (Capacitor Sync)...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [錯誤] 同步至 Android 失敗！
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] 正在開啟 Android Studio 進行 APK 編譯...
echo (如果您已安裝 Android Studio，將會自動開啟專案；您可以在頂部選單點擊 [Build] -> [Build Bundle(s) / APK(s)] -> [Build APK(s)] 即完成產生！)
call npx cap open android

echo.
echo ==============================================
echo 同步完成！
echo ==============================================
pause
