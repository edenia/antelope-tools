import { blue, green, grey } from '@mui/material/colors'

const lightVariant = {
  name: 'Light',
  palette: {
    primary: {
      main: blue[800],
      contrastText: '#FFF'
    },
    secondary: {
      main: blue[600],
      contrastText: '#FFF'
    },
    tertiary: {
      main: '#00C853',
      contrastText: '#FFF'
    }
  },
  header: {
    color: grey[500],
    background: '#FFF',
    search: {
      color: grey[800]
    },
    indicator: {
      background: blue[600]
    }
  },
  sidebar: {
    color: grey[900],
    background: '#FFF',
    header: {
      color: blue[800],
      background: '#FFF',
      brand: {
        color: blue[800]
      }
    },
    footer: {
      color: '#424242',
      background: '#FFF'
    },
    category: {
      fontWeight: 'normal'
    },
    badge: {
      color: '#FFF'
    }
  },
  body: {
    background: '#F7F9FC'
  }
}

const darkVariant = {
  name: 'Dark',
  palette: {
    primary: {
      main: blue[700],
      contrastText: '#FFF'
    },
    secondary: {
      main: blue[500],
      contrastText: '#FFF'
    }
  },
  header: {
    color: grey[500],
    background: '#FFFFFF',
    search: {
      color: grey[800]
    },
    indicator: {
      background: blue[600]
    }
  },
  sidebar: {
    color: grey[200],
    background: '#1B2430',
    header: {
      color: grey[200],
      background: '#232f3e',
      brand: {
        color: blue[500]
      }
    },
    footer: {
      color: grey[200],
      background: '#232f3e',
      online: {
        background: green[500]
      }
    },
    category: {
      fontWeight: 400
    },
    badge: {
      color: '#FFF',
      background: blue[500]
    }
  },
  body: {
    background: '#F7F9FC'
  }
}

const variants = [lightVariant, darkVariant]

export default variants
