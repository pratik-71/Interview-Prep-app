import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  textSecondaryColor: string
  borderColor: string
  shadowColor: string
  hoverColor: string
  cardColor: string
  inputColor: string
  errorColor: string
  successColor: string
  warningColor: string
  infoColor: string
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  setTertiaryColor: (color: string) => void
  resetTheme: () => void
}

// Light mode colors
const lightColors = {
  primaryColor: '#00b2d6',
  secondaryColor: '#fbfbfe',
  tertiaryColor: '#020612',
  backgroundColor: '#f8fafc',
  surfaceColor: '#ffffff',
  textColor: '#1f2937',
  textSecondaryColor: '#6b7280',
  borderColor: '#e5e7eb',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  hoverColor: '#f3f4f6',
  cardColor: '#ffffff',
  inputColor: '#ffffff',
  errorColor: '#ef4444',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  infoColor: '#3b82f6'
}

// Dark mode colors
const darkColors = {
  primaryColor: '#00d4ff',
  secondaryColor: '#0f172a',
  tertiaryColor: '#f8fafc',
  backgroundColor: '#0f172a',
  surfaceColor: '#1e293b',
  textColor: '#f8fafc',
  textSecondaryColor: '#cbd5e1',
  borderColor: '#334155',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  hoverColor: '#334155',
  cardColor: '#1e293b',
  inputColor: '#334155',
  errorColor: '#f87171',
  successColor: '#34d399',
  warningColor: '#fbbf24',
  infoColor: '#60a5fa'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      ...lightColors,
      
      toggleDarkMode: () => {
        const { isDarkMode } = get()
        const newMode = !isDarkMode
        set({
          isDarkMode: newMode,
          ...(newMode ? darkColors : lightColors)
        })
      },
      
      setDarkMode: (isDark: boolean) => {
        set({
          isDarkMode: isDark,
          ...(isDark ? darkColors : lightColors)
        })
      },
      
      setPrimaryColor: (color: string) => set({ primaryColor: color }),
      setSecondaryColor: (color: string) => set({ secondaryColor: color }),
      setTertiaryColor: (color: string) => set({ tertiaryColor: color }),
      
      resetTheme: () => {
        const { isDarkMode } = get()
        set({
          ...(isDarkMode ? darkColors : lightColors)
        })
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
)
