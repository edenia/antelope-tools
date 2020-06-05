import { colors } from '@material-ui/core'

const white = '#FFFFFF'
const black = '#000000'

export default {
  black,
  white,
  primary: {
    main: '#212121',
    light: '#757575',
    contrastText: 'rgba(255, 255, 255, 1)',
    800: '#424242',
    700: '#616161',
    600: '#757575',
    500: '#9E9E9E',
    400: '#BDBDBD',
    300: '#E0E0E0',
    200: '#EEEEEE',
    100: '#F5F5F5',
    50: '#FAFAFA',
    onPrimaryHighEmphasizedText: 'rgba(255, 255, 255, 1)',
    onPrimaryMediumEmphasizedText: 'rgba(255, 255, 255, 0.6)',
    onPrimaryDisabledText: 'rgba(255, 255, 255, 0.38)',
    highEmphasizedBlackText: 'rgba(0, 0, 0, 0.87)',
    mediumEmphasizedBlackText: 'rgba(0, 0, 0, 0.6)',
    disabledBlackText: 'rgba(0, 0, 0, 0.38)'
  },
  secondary: {
    main: '#3EBBD3',
    light: '#5ECFE2',
    dark: '#39ABC0',
    contrastText: 'rgba(0, 0, 0, 0.87)',
    900: '#265F63',
    800: '#2F828E',
    700: '#3496A6',
    600: '#39ABC0',
    500: '#3EBBD3',
    400: '#47C5DA',
    300: '#5ECFE2',
    200: '#88DDEB',
    100: '#B6EBF3',
    50: '#E1F7FA',
    onSecondaryHighEmphasizedText: 'rgba(0, 0, 0, 0.87)',
    onSecondaryMediumEmphasizedText: 'rgba(0, 0, 0, 0.6)',
    onSecondaryDisabledText: 'rgba(0, 0, 0, 0.38)',
    highEmphasizedWhiteText: 'rgba(255, 255, 255, 1)',
    mediumEmphasizedWhiteText: 'rgba(255, 255, 255, 0.6)',
    disabledWhiteText: 'rgba(255, 255, 255, 0.38)'
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: black,
    secondary: colors.blueGrey[600],
    link: colors.blue[600]
  },
  background: {
    default: '#F4F6F8',
    paper: white
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200]
}
