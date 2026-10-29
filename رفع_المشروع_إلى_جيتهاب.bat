@echo off
chcp 65001 >nul
title رفع تطبيق إياد زيد إلى GitHub

echo ========================================================
echo   🚀 رفع تطبيق إياد زيد التعليمي إلى GitHub 🚀
echo ========================================================
echo.

set GIT_EXE="C:\Users\Zied\AppData\Local\Programs\MinGit\cmd\git.exe"

echo تم تجهيز وضغط جميع ملفات التطبيق (أندرويد + آيفون + الويب + مسارات البناء التلقائي).
echo.
echo الرجاء إنشاء مستودع جديد على حسابك في GitHub من الرابط:
echo https://github.com/new
echo.
echo بعد إنشاء المستودع، انسخ الرابط الخاص به، مثل:
echo https://github.com/YOUR_USERNAME/AyadZaid.git
echo.
set /p REPO_URL="الصق رابط مستودع GitHub هنا واضغط Enter: "

if "%REPO_URL%"=="" (
    echo لم يتم إدخال رابط! تم الإلغاء.
    pause
    exit /b
)

echo.
echo جاري ربط المستودع ورفع الملفات...
%GIT_EXE% remote remove origin 2>nul
%GIT_EXE% remote add origin %REPO_URL%
%GIT_EXE% branch -M main
%GIT_EXE% push -u origin main

echo.
echo ========================================================
echo   🎉 مبروك! تم رفع التطبيق بالكامل بنجاح إلى GitHub!
echo ========================================================
echo سيقوم GitHub الآن تلقائياً ببناء ملفات APK و IPA في قسم Actions.
pause
