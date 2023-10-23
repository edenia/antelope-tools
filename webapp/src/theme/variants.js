import { blue, green, grey } from '@mui/material/colors'

const lightVariant = {
  name: 'Light',
  palette: {
    mode: 'light',
    primary: {
      main: blue[800],
      contrastText: '#FFF',
    },
    secondary: {
      main: green.A700,
      contrastText: '#FFF',
    },
    text: {
      primary: '#000',
    },
    background: {
      light: '#F7F9FC',
      default: '#FFF',
      paper: '#FFF',
    },
    neutral: {
      lighter: '#F0F3FA',
      light: '#E0E0E0',
      main: '#858585',
      dark: '#4E4E4E',
      darker: '#2E2E2E',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
      contrastText: '#FFF',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
      contrastText: '#FFF',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
      contrastText: '#FFF',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFF',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      hoverOpacity: '0.04',
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: '0.08',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: '0.38',
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: '0.12',
      activatedOpacity: '0.12',
    },
    shadows: {
      card: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      tooltip: '0px 1px 5px rgba(0, 0, 0, 0.15)',
      nodeCard: '2px 3px 4px 0px #0000002E',
      profileCard: '0px -2px 8px 0px #0000004D',
      hover: `0px 0px 40px -30px ${blue[800]}bf inset`,
      authBox: `0px 0px 3px 3px ${blue[800]}`,
      producerChart: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
    },
    sidebar: {
      activeLink: '#f2f2f2',
    }
  },
}

const darkVariant = {
  name: 'Dark',
  palette: {
    mode: 'dark',
    primary: {
      main: '#1CCBFF',
      contrastText: '#000',
    },
    secondary: {
      main: '#00C853',
      light: '#F3E5F5',
      dark: '#AB47BC',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    text: {
      primary: '#FFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      icon: 'rgba(255, 255, 255, 0.12)',
    },
    background: {
      light: '#041426',
      default: '#051B34',
      paper: '#051B34',
    },
    neutral: {
      lighter: '#0E4480',
      light: '#FFFFFF33',
      main: grey[300],
      dark: grey[200],
      darker: grey[100],
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFF',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    action: {
      active: '#FFF',
      hover: 'rgba(255, 255, 255, 0.08)',
      hoverOpacity: '0.08',
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: '0.16',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      disabledOpacity: '0.38',
      focus: 'rgba(255, 255, 255, 0.12)',
      focusOpacity: '0.12',
      activatedOpacity: '0.24',
    },
    shadows: {
      card: '0px 0px 14px 0px #3540520D',
      tooltip: '0px 1px 5px rgba(0, 0, 0, 0.15)',
      nodeCard: '2px 3px 4px 0px #0000002E',
      profileCard: '0px -2px 8px 0px #0000004D',
      hover: `0px 0px 40px -30px #1CCBFFBF inset`,
      authBox: `0px 0px 3px 3px #1CCBFF`,
      producerChart: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
    },
    sidebar: {
      activeLink: '#166CCD',
    },
  },
}

const variants = [lightVariant, darkVariant]

export default variants
