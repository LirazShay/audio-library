@echo off
setlocal
cd /d "%~dp0\.."

echo.
echo ========================================
echo Audio Library - Local Check
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found in PATH.
  echo Install Node.js and try again.
  pause
  exit /b 2
)

echo [1/2] Running automated generator tests...
node --test tools\generate-library.test.js
if errorlevel 1 (
  echo.
  echo ERROR: Generator tests failed.
  pause
  exit /b 1
)

echo.
echo [2/2] Generating src\data\library.json...
node tools\generate-library.js
set GENERATOR_EXIT=%ERRORLEVEL%

if %GENERATOR_EXIT% GEQ 2 (
  echo.
  echo ERROR: Generator failed critically.
  pause
  exit /b %GENERATOR_EXIT%
)

if %GENERATOR_EXIT% EQU 1 (
  echo.
  echo WARNING: Generator completed with content errors.
  echo Review the messages above. Valid content was still generated.
)

echo.
echo Local checks completed.
echo Output: src\data\library.json
echo.
exit /b %GENERATOR_EXIT%
