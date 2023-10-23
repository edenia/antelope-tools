import React from 'react'
import IconButton from '@mui/material/IconButton'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useTheme } from '@mui/material/styles'

import { useThemeStateContext } from 'context/theme.context'

const ToggleColorMode = () => {
  const theme = useTheme()
  const [, { toggleColorMode }] = useThemeStateContext()

  return (
    <IconButton
      onClick={toggleColorMode}
    >
      {theme.palette.mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  )
}

export default ToggleColorMode
