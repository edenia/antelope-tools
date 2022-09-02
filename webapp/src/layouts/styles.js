export default (theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  drawer: {
    [theme.breakpoints.down('md')]: {
      width: '0 !important',
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
    padding: theme.spacing(6),
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
      textAlign: 'center',
      marginBottom: theme.spacing(2)
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      '& h3': {
        marginTop: 0
      }
    }
  },
  boxReadmore: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    '& span': {
      fontSize: 14,
      letterSpacing: '0.3px',
      color: '#1565C0',
      marginLeft: theme.spacing(1),
      '&:hover': {
        cursor: 'pointer'
      }
    },
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
      '& span': {
        marginLeft: theme.spacing(4)
      }
    }
  },
  boxHeader: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiCollapse-container': {
      marginTop: theme.spacing(2)
    }
  },
  textAlignReadMore: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'inherit !important'
    }
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  }
})