# Dark Mode Implementation Guide

This guide explains how to implement dark mode in your components using the theme store.

## Theme Store Usage

The theme store provides comprehensive color schemes for both light and dark modes. Import it in your component:

```typescript
import { useThemeStore } from '../zustand_store/theme_store';

const MyComponent = () => {
  const { 
    isDarkMode,
    primaryColor,
    backgroundColor,
    surfaceColor,
    textColor,
    textSecondaryColor,
    borderColor,
    hoverColor,
    cardColor,
    inputColor,
    errorColor,
    successColor,
    warningColor,
    infoColor
  } = useThemeStore();
  
  // Use these colors in your component
};
```

## Available Theme Colors

### Light Mode Colors
- `backgroundColor`: `#f8fafc` - Main background
- `surfaceColor`: `#ffffff` - Card/surface backgrounds
- `textColor`: `#1f2937` - Primary text
- `textSecondaryColor`: `#6b7280` - Secondary text
- `borderColor`: `#e5e7eb` - Borders
- `hoverColor`: `#f3f4f6` - Hover states
- `cardColor`: `#ffffff` - Card backgrounds
- `inputColor`: `#ffffff` - Input backgrounds

### Dark Mode Colors
- `backgroundColor`: `#0f172a` - Main background
- `surfaceColor`: `#1e293b` - Card/surface backgrounds
- `textColor`: `#f8fafc` - Primary text
- `textSecondaryColor`: `#cbd5e1` - Secondary text
- `borderColor`: `#334155` - Borders
- `hoverColor`: `#334155` - Hover states
- `cardColor`: `#1e293b` - Card backgrounds
- `inputColor`: `#334155` - Input backgrounds

## Implementation Examples

### Basic Component with Dark Mode

```typescript
const MyComponent = () => {
  const { backgroundColor, textColor, surfaceColor, borderColor } = useThemeStore();
  
  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: backgroundColor }}
    >
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: surfaceColor,
          borderColor: borderColor,
          color: textColor
        }}
      >
        <h1>My Component</h1>
        <p>This component supports dark mode!</p>
      </div>
    </div>
  );
};
```

### Button with Hover Effects

```typescript
const MyButton = () => {
  const { primaryColor, hoverColor, textColor } = useThemeStore();
  
  return (
    <button
      className="px-4 py-2 rounded-lg transition-colors duration-200"
      style={{ 
        backgroundColor: primaryColor,
        color: 'white'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = primaryColor;
      }}
    >
      Click me
    </button>
  );
};
```

### Form Input with Dark Mode

```typescript
const MyInput = () => {
  const { inputColor, textColor, borderColor } = useThemeStore();
  
  return (
    <input
      type="text"
      className="w-full px-4 py-2 rounded-lg border transition-colors duration-300"
      style={{
        backgroundColor: inputColor,
        color: textColor,
        borderColor: borderColor
      }}
      placeholder="Enter text..."
    />
  );
};
```

## CSS Variables

The theme system also provides CSS variables that automatically update based on the current theme:

```css
/* These variables automatically change with the theme */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
```

## Best Practices

1. **Always use transition-colors duration-300** for smooth theme switching
2. **Use the theme store colors** instead of hardcoded colors
3. **Test both themes** to ensure good contrast and readability
4. **Use semantic color names** from the theme store (e.g., `errorColor`, `successColor`)
5. **Apply hover effects** using the `hoverColor` from the theme store

## Toggle Dark Mode

To toggle dark mode programmatically:

```typescript
const { toggleDarkMode, setDarkMode } = useThemeStore();

// Toggle between light and dark
toggleDarkMode();

// Set specific theme
setDarkMode(true);  // Force dark mode
setDarkMode(false); // Force light mode
```

## Persistence

The theme preference is automatically saved to localStorage and restored on page reload. No additional setup required.
