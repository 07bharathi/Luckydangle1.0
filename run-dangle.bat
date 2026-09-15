@echo off
title Lucky Dangle

if exist "%~dp0dist\win-unpacked\Lucky Dangle.exe" (
    start "" "%~dp0dist\win-unpacked\Lucky Dangle.exe"
    exit
)

start "" /b npx electron .
exit
