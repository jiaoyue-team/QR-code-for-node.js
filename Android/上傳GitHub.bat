@echo off
chcp 65001 >nul
echo ========================================================
echo          QR狗 (QR Dog) - GitHub 一鍵上傳工具
echo ========================================================
echo.
echo 請先在 GitHub (https://github.com/new) 建立一個新的空白 Repository。
echo.
set /p REPO_URL="請貼上您的 GitHub 倉庫網址 (例如 https://github.com/username/qr-dog.git): "

if "%REPO_URL%"=="" (
    echo [錯誤] 網址不能為空！
    pause
    exit /b 1
)

echo.
echo [1/4] 正在加入檔案到 Git...
git add .

echo.
echo [2/4] 正在建立 Commit...
git commit -m "Initial commit: QR Dog Android App"

echo.
echo [3/4] 設定主分支為 main...
git branch -M main

echo.
echo [4/4] 正在連結遠端倉庫並推送...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [提示] 如果推送失敗，可能是需要登入 GitHub 或是網址輸入錯誤。
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo  🎉 恭喜！專案已成功上傳到 GitHub！
echo ========================================================
echo.
pause
