@echo off
chcp 65001 >nul
title تطبيق إياد زيد التعليمي للأطفال | Ayad Zaid App

echo ========================================================
echo   🌟 جاري تشغيل سيرفر تطبيق إياد زيد التعليمي 🌟
echo ========================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

set NODE_EXE="C:\Program Files\nodejs\node.exe"
if not exist %NODE_EXE% (
    set NODE_EXE=node
)

echo يتم تشغيل التطبيق وفتح المتصفح...
start http://localhost:8080

%NODE_EXE% server.js

pause
