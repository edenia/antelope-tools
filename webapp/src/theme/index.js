import { createTheme } from '@mui/material/styles'

import variants from './variants'
import typography from './typography'
import components from './components'
import breakpoints from './breakpoints'
import props from './props'
import shadows from './shadows'

const theme = (variant) => {
  return createTheme(
    {
      spacing: 4,
      breakpoints,
      props,
      typography,
      shadows,
      palette: variant.palette,
      components
    },
    {
      name: variant.name,
    }
  )
}

const themes = variants.map((variant) => theme(variant))

export default themes
