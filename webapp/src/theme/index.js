import { createTheme } from '@material-ui/core/styles'

import variants from './variants'
import typography from './typography'
import overrides from './overrides'
import breakpoints from './breakpoints'
import props from './props'
import shadows from './shadows'

const theme = (variant) => {
  return createTheme(
    {
      spacing: 4,
      breakpoints: breakpoints,
      overrides: overrides,
      props: props,
      typography: typography,
      shadows: shadows,
      palette: variant.palette
    },
    {
      name: variant.name,
      body: variant.body,
      header: variant.header,
      sidebar: variant.sidebar
    }
  )
}

const themes = variants.map((variant) => theme(variant))

export default themes
