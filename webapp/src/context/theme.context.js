import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ThemeProvider } from 'styled-components'

import themes from '../theme'

const ThemeStateContext = React.createContext({ toggleColorMode: () => {} })

export const ThemeStateProvider = ({ children }) => {
  const userRequest = useMediaQuery('(prefers-color-scheme: dark)')
  const preference = localStorage.getItem('prefersDarkMode')
  const prefersDarkMode = preference ? Boolean(JSON.parse(preference)) : userRequest

  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light')

  if (!preference) {
    localStorage.setItem('prefersDarkMode', prefersDarkMode)
  }

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => {
          localStorage.setItem('prefersDarkMode', prev === 'light')

          return prev === 'light' ? 'dark' : 'light'
        })
      },
    }),
    [],
  )

  const theme = React.useMemo(() => themes[mode === 'light' ? 0 : 1], [mode])

  return (
    <ThemeStateContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MuiThemeProvider>
    </ThemeStateContext.Provider>
  )
}

export const useThemeStateContext = () => {
  const context = React.useContext(ThemeStateContext)

  const { toggleColorMode } = context

  return [{}, { toggleColorMode }]
}
