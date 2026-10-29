@echo off
chcp 65001 >nul
title رفع تطبيق إياد زيد إلى GitHub

echo ========================================================
echo   🚀 رفع تطبيق إياد زيد التعليمي إلى GitHub 🚀
echo ========================================================
echo.

set PATH=C:\Program Files\GitHub CLI;C:\Users\Zied\AppData\Local\Programs\MinGit\cmd;%PATH%

echo 1. التحقق من تسجيل الدخول إلى GitHub...
gh auth status >nul 2>&1
if errorlevel 1 (
    echo جاري فتح صفحة تسجيل الدخول في المتصفح...
    gh auth login --web -h github.com -p https
)

echo.
echo 2. جاري رفع التطبيق بالكامل إلى مستودعك:
echo    https://github.com/Zied995/AyadZaid.git
echo.
git remote remove origin 2>nul
git remote add origin https://github.com/Zied995/AyadZaid.git
git branch -M main
git push -u origin main

echo.
echo ========================================================
echo   🎉 مبروك! تم رفع التطبيق بالكامل بنجاح إلى GitHub!
echo ========================================================
echo سيقوم GitHub الآن تلقائياً ببناء ملفات APK و IPA في قسم Actions.
pause
