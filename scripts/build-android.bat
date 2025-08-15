@echo off
REM Interview Prep Android Build Script for Windows
REM This script handles version management and Android builds

echo 🚀 Starting Interview Prep Android Build...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the frontend directory
    pause
    exit /b 1
)

REM Get current version
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set CURRENT_VERSION=%%i
echo [INFO] Current version: %CURRENT_VERSION%

REM Ask user if they want to increment version
set /p INCREMENT_VERSION="Do you want to increment the version? (y/n): "
if /i "%INCREMENT_VERSION%"=="y" (
    set /p VERSION_TYPE="Which version to increment? (patch/minor/major): "
    if /i "%VERSION_TYPE%"=="patch" (
        echo [INFO] Incrementing patch version...
        npm version patch
    ) else if /i "%VERSION_TYPE%"=="minor" (
        echo [INFO] Incrementing minor version...
        npm version minor
    ) else if /i "%VERSION_TYPE%"=="major" (
        echo [INFO] Incrementing major version...
        npm version major
    ) else (
        echo [ERROR] Invalid version type. Using current version.
    )
    
    REM Get new version
    for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%i
    echo [SUCCESS] Version updated to: %NEW_VERSION%
)

REM Get current version (updated or not)
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%i

REM Update version.json
echo [INFO] Updating version.json...
set CURRENT_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%T%time:~0,2%:%time:~3,2%:%time:~6,2%Z

(
echo {
echo   "version": "%NEW_VERSION%",
echo   "buildNumber": "%time:~0,2%%time:~3,2%%time:~6,2%",
echo   "lastUpdated": "%CURRENT_DATE%",
echo   "forceUpdate": false,
echo   "changelog": [
echo     "Version %NEW_VERSION% update",
echo     "Bug fixes and improvements",
echo     "Enhanced user experience"
echo   ],
echo   "minRequiredVersion": "1.0.0",
echo   "downloadUrl": "https://github.com/yourusername/interview-prep/releases/latest",
echo   "releaseNotes": "Version %NEW_VERSION% release"
echo }
) > public\version.json

echo [SUCCESS] version.json updated

REM Update version config file
echo [INFO] Updating version config...
set BUILD_NUMBER=%time:~0,2%%time:~3,2%%time:~6,2%

(
echo // This file is automatically updated during build process
echo // Do not edit manually
echo.
echo export const APP_VERSION = '%NEW_VERSION%';
echo export const BUILD_NUMBER = '%BUILD_NUMBER%';
echo export const BUILD_DATE = '%CURRENT_DATE%';
echo.
echo export const VERSION_CONFIG = {
echo   version: APP_VERSION,
echo   buildNumber: BUILD_NUMBER,
echo   buildDate: BUILD_DATE,
echo   minRequiredVersion: '1.0.0'
echo };
) > src\config\version.ts

echo [SUCCESS] version config updated

REM Clean previous builds
echo [INFO] Cleaning previous builds...
if exist "build" rmdir /s /q "build"
npx cap clean

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
)

REM Build the web app
echo [INFO] Building web application...
npm run build

if %errorlevel% neq 0 (
    echo [ERROR] Web build failed!
    pause
    exit /b 1
)

echo [SUCCESS] Web build completed

REM Sync with Capacitor
echo [INFO] Syncing with Capacitor...
npx cap sync

if %errorlevel% neq 0 (
    echo [ERROR] Capacitor sync failed!
    pause
    exit /b 1
)

echo [SUCCESS] Capacitor sync completed

REM Build Android
echo [INFO] Building Android application...
npx cap build android

if %errorlevel% neq 0 (
    echo [ERROR] Android build failed!
    pause
    exit /b 1
)

echo [SUCCESS] Android build completed!

REM Show build info
set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk
if exist "%APK_PATH%" (
    echo [SUCCESS] APK created successfully!
    echo [INFO] APK location: %APK_PATH%
    echo [INFO] Version: %NEW_VERSION%
) else (
    echo [ERROR] APK not found at expected location!
    pause
    exit /b 1
)

REM Optional: Install on connected device
where adb >nul 2>nul
if %errorlevel% equ 0 (
    set /p INSTALL_APK="Do you want to install the APK on a connected device? (y/n): "
    if /i "%INSTALL_APK%"=="y" (
        echo [INFO] Installing APK on device...
        adb install -r "%APK_PATH%"
        if %errorlevel% equ 0 (
            echo [SUCCESS] APK installed successfully!
        ) else (
            echo [WARNING] APK installation failed. Please check device connection.
        )
    )
)

echo [SUCCESS] 🎉 Build process completed successfully!
echo [INFO] Next steps:
echo [INFO] 1. Test the APK on your device
echo [INFO] 2. Commit and push your changes
echo [INFO] 3. Create a GitHub release if needed

pause
