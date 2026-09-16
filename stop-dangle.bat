@echo off
title Stop Lucky Dangle
taskkill /F /IM "Lucky Dangle.exe" /T >nul 2>&1
taskkill /F /IM electron.exe /T >nul 2>&1
echo Lucky Dangle has been stopped.
timeout /t 2 >nul
