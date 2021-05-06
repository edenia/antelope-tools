export default (theme, drawerWidth) => ({
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1,
    background: theme.body.background,
    '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
      flex: 'none'
    },
    '& .MuiPaper-root .MuiPaper-root': {
      boxShadow: 'none'
    }
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    borderBottom: '1px solid #e0e0e0',
    width: '100%',
    '& h3': {
      marginTop: theme.spacing(4),
      textAlign: 'center'
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& h3': {
        marginTop: 0
      }
    }
  }
})
