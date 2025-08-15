#!/bin/bash

# Interview Prep Android Build Script
# This script handles version management and Android builds

echo "🚀 Starting Interview Prep Android Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the frontend directory"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Ask user if they want to increment version
read -p "Do you want to increment the version? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Which version to increment? (patch/minor/major): " VERSION_TYPE
    case $VERSION_TYPE in
        "patch"|"minor"|"major")
            print_status "Incrementing $VERSION_TYPE version..."
            npm version $VERSION_TYPE
            NEW_VERSION=$(node -p "require('./package.json').version")
            print_success "Version updated to: $NEW_VERSION"
            ;;
        *)
            print_error "Invalid version type. Using current version."
            ;;
    esac
fi

# Update version.json
print_status "Updating version.json..."
NEW_VERSION=$(node -p "require('./package.json').version")
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
BUILD_NUMBER=$(date +%s)

cat > public/version.json << EOF
{
  "version": "$NEW_VERSION",
  "buildNumber": "$BUILD_NUMBER",
  "lastUpdated": "$CURRENT_DATE",
  "forceUpdate": false,
  "changelog": [
    "Version $NEW_VERSION update",
    "Bug fixes and improvements",
    "Enhanced user experience"
  ],
  "minRequiredVersion": "1.0.0",
  "downloadUrl": "https://github.com/yourusername/interview-prep/releases/latest",
  "releaseNotes": "Version $NEW_VERSION release"
}
EOF

# Update version config file
print_status "Updating version config..."
cat > src/config/version.ts << EOF
// This file is automatically updated during build process
// Do not edit manually

export const APP_VERSION = '$NEW_VERSION';
export const BUILD_NUMBER = '$BUILD_NUMBER';
export const BUILD_DATE = '$CURRENT_DATE';

export const VERSION_CONFIG = {
  version: APP_VERSION,
  buildNumber: BUILD_NUMBER,
  buildDate: BUILD_DATE,
  minRequiredVersion: '1.0.0'
};
EOF

print_success "version.json updated"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf build/
npx cap clean

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Build the web app
print_status "Building web application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Web build failed!"
    exit 1
fi

print_success "Web build completed"

# Sync with Capacitor
print_status "Syncing with Capacitor..."
npx cap sync

if [ $? -ne 0 ]; then
    print_error "Capacitor sync failed!"
    exit 1
fi

print_success "Capacitor sync completed"

# Build Android
print_status "Building Android application..."
npx cap build android

if [ $? -ne 0 ]; then
    print_error "Android build failed!"
    exit 1
fi

print_success "Android build completed!"

# Show build info
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    print_success "APK created successfully!"
    print_status "APK location: $APK_PATH"
    print_status "APK size: $APK_SIZE"
    print_status "Version: $NEW_VERSION"
else
    print_error "APK not found at expected location!"
    exit 1
fi

# Optional: Install on connected device
if command -v adb &> /dev/null; then
    read -p "Do you want to install the APK on a connected device? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Installing APK on device..."
        adb install -r "$APK_PATH"
        if [ $? -eq 0 ]; then
            print_success "APK installed successfully!"
        else
            print_warning "APK installation failed. Please check device connection."
        fi
    fi
fi

print_success "🎉 Build process completed successfully!"
print_status "Next steps:"
print_status "1. Test the APK on your device"
print_status "2. Commit and push your changes"
print_status "3. Create a GitHub release if needed"
