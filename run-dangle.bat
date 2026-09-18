@echo off
title Lucky Dangle

where npx >nul 2>nul
if %errorlevel% equ 0 (
    start "" /b npx electron .
    exit
)

if exist "%~dp0dist\win-unpacked\Lucky Dangle.exe" (
    start "" "%~dp0dist\win-unpacked\Lucky Dangle.exe"
    exit
)

start "" /b npx electron .
exit
