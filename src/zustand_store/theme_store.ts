import { create } from 'zustand'

interface ThemeState {
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  setTertiaryColor: (color: string) => void
  resetTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: '#00b2d6',
  secondaryColor: '#fbfbfe',
  tertiaryColor: '#020612',
  
  setPrimaryColor: (color: string) => set({ primaryColor: color }),
  setSecondaryColor: (color: string) => set({ secondaryColor: color }),
  setTertiaryColor: (color: string) => set({ tertiaryColor: color }),
  resetTheme: () => set({
    primaryColor: '#00b2d6',
    secondaryColor: '#fbfbfe',
    tertiaryColor: '#020612'
  }),
}))
