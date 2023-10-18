import { blue, green, grey } from '@mui/material/colors'

const lightVariant = {
  name: 'Light',
  palette: {
    primary: {
      main: blue[800],
      contrastText: '#FFF',
    },
    secondary: {
      main: green['A700'],
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
      main: '#0003',
      dark: '#4E4E4E',
      darker: '#2E2E2E',
    },
    shadows: {
      card: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      tooltip: '0px 1px 5px rgba(0, 0, 0, 0.15)',
      nodeCard: '2px 3px 4px 0px #0000002E',
      profileCard: '0px -2px 8px 0px #0000004D',
      hover: '0px 0px 40px -30px #1565c0bf inset',
    } 
  },
}

const darkVariant = {
  name: 'Dark',
  palette: {
    mode: 'dark',
    primary: {
      main: blue[800],
      contrastText: '#FFF',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    text: {
      primary: '#FFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      icon: 'rgba(255, 255, 255, 0.12)',
    },
    background: {
      light: '#000',
      default: '#1B2430',
      paper: '#1B2430'
    },
    action: {
      active: '#fff',
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
    neutral: {
      lighter: grey[800],
      light: grey[600],
      main: grey[300],
      dark: grey[200],
      darker: grey[100],
    },
    shadows: {
      card: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      tooltip: '0px 1px 5px rgba(0, 0, 0, 0.15)',
      nodeCard: '2px 3px 4px 0px #0000002E',
      profileCard: '0px -2px 8px 0px #0000004D',
      hover: '0px 0px 40px -30px #1565c0bf inset',
    } 
  },
}

const variants = [lightVariant, darkVariant]

export default variants
