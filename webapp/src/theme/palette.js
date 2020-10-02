import { colors } from '@material-ui/core'
import { EOSCR_THEME } from '@eoscostarica/eoscr-theme'

export default {
  primary: {
    ...EOSCR_THEME.palette.primary
  },
  secondary: {
    ...EOSCR_THEME.palette.secondary
  },
  success: {
    contrastText: EOSCR_THEME.palette.primary.contrastText,
    dark: EOSCR_THEME.palette.primary.main,
    main: EOSCR_THEME.palette.primary.main,
    light: EOSCR_THEME.palette.primary.light
  },
  info: {
    contrastText: EOSCR_THEME.palette.secondary[50],
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: EOSCR_THEME.palette.primary[50],
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: EOSCR_THEME.palette.primary[50],
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: EOSCR_THEME.palette.primary.main,
    secondary: EOSCR_THEME.palette.secondary.onSecondaryHighEmphasizedText,
    link: EOSCR_THEME.palette.secondary.main
  },
  background: {
    default: EOSCR_THEME.palette.primary[100],
    paper: EOSCR_THEME.palette.primary[50]
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200]
}
