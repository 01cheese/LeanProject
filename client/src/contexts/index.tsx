import { ThemeProvider } from '@pankod/refine-mui'
import { DarkTheme, LightTheme } from '@pankod/refine-mui'

import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react'

type ColorModeContextType = {
  mode: string
  setMode: () => void
}

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType,
)

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem('colorMode')
  const isSystemPreferenceDark = window?.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches

  const systemPreference = isSystemPreferenceDark ? 'dark' : 'light'
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference,
  )

  useEffect(() => {
    window.localStorage.setItem('colorMode', mode)
  }, [mode])

  const setColorMode = () => {
    if (mode === 'light') {
      setMode('dark')
    } else {
      setMode('light')
    }
  }

  const overridedDarkTheme = {
    ...DarkTheme,
    palette: {
      ...DarkTheme.palette,
      background: {
        default: '#111315',
        paper: '#1A1D1F',
      },
      info: {
        main: '#475be8',
        contrastText: '#1e36e8',
      },
      text: {
        primary: '#efefef',
        secondary: '#6f767e',
      },
    },
  }

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider theme={mode === 'light' ? LightTheme : overridedDarkTheme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
