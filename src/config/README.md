# Backend Configuration Guide

## Overview
This configuration system automatically handles backend URL selection based on the platform and environment.

## How It Works

### 1. **Mobile Apps (Android/iOS)**
- **Always use production backend**: `https://interview-prep-backend-viok.onrender.com`
- **No CORS issues** because mobile apps don't enforce CORS policies
- **No port needed** - mobile apps make direct HTTP requests

### 2. **Web Browser (Development)**
- **Uses local backend**: `http://localhost:10000`
- **For local development and testing**

### 3. **Web Browser (Production)**
- **Uses production backend**: `https://interview-prep-backend-viok.onrender.com`
- **For deployed web apps**

## Platform Detection

```typescript
import { getBackendConfig, isMobileApp, getPlatformType } from '../utils/platformDetection';

// Check if running in mobile app
const isMobile = isMobileApp(); // true for Android/iOS, false for web

// Get platform type
const platform = getPlatformType(); // 'android', 'ios', 'web', or 'unknown'

// Get backend configuration
const config = getBackendConfig();
// Always correct URL for current platform
```

## Usage Examples

### In Services
```typescript
import { apiService } from '../services/apiService';

// Automatically uses correct backend URL
const user = await apiService.get('/auth/me', token);
```

### Direct API Calls
```typescript
import { getApiUrl } from '../services/apiService';

const url = getApiUrl('/auth/login');
const response = await fetch(url, { method: 'POST', body: JSON.stringify(data) });
```

## Why This Approach?

1. **No CORS Issues**: Mobile apps bypass CORS restrictions
2. **Automatic Configuration**: No manual switching between environments
3. **Production Ready**: Mobile apps always use production backend
4. **Development Friendly**: Web development still uses local backend
5. **Single Source of Truth**: All backend URLs defined in one place

## Backend Requirements

Your backend at `https://interview-prep-backend-viok.onrender.com` must:
- Accept requests from any origin (mobile apps)
- Handle authentication properly
- Return proper JSON responses
- Have CORS configured for web browsers (if needed)
