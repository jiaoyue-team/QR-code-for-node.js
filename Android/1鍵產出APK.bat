@echo off
chcp 65001 >nul
echo ========================================================
echo          QR狗 (QR Dog) - 一鍵自動編譯 APK 工具
echo ========================================================
echo.

set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk"

echo [1/3] 正在編譯最新前端介面 (Vite Build)...
call npm run build
if %errorlevel% neq 0 (
    echo [錯誤] 前端編譯失敗！
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] 正在同步資源至 Android 原生專案...
call xcopy /E /I /Y "dist\*" "android\app\src\main\assets\public\" >nul

echo.
echo [3/3] 正在呼叫 Gradle 原生引擎編譯 APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [錯誤] APK 編譯失敗！
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [4/4] 複製 APK 到專案根目錄...
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "QR狗-最新版.apk" >nul

echo.
echo ========================================================
echo  🎉 恭喜！APK 編譯成功！
echo  檔案名稱：QR狗-最新版.apk
echo  檔案位置：本專案根目錄
echo ========================================================
echo.
pause
