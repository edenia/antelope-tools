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
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    borderBottom: '1px solid #e0e0e0',
    width: '100%',
    '& h3': {
      marginTop: theme.spacing(4)
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& h3': {
        marginTop: 0
      }
    }
  },
  network: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: theme.palette.primary.main,
    paddingLeft: 22,
    '& img': {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor: theme.palette.primary.contrastText
    },
    borderRadius: '8px 16px 16px 8px',
    minWidth: 220,
    color: theme.palette.primary.contrastText
  },
  networkLogo: {
    border: `2px solid ${theme.palette.primary.main}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: '100%',
    zIndex: 2,
    position: 'absolute',
    right: 10,
    backgroundColor: theme.palette.common.white
  }
})
