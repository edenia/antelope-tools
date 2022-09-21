export default (theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
  },
  drawer: {
    display: 'flex',
    boxShadow: '0px 0px 14px rgba(53, 64, 82, 0.25) !important',
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
      width: '0 !important',
      flexShrink: 0,
    },
  },
  appContent: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      flex: 1,
    },
    [theme.breakpoints.down('md')]: {
      flex: 'none',
    },
  },
  mainContent: {
    padding: theme.spacing(4),
    minHeight: '90vh',
    background: theme.body.background,
    '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
      flex: 'none',
    },
    '& .MuiPaper-root .MuiPaper-root': {
      boxShadow: 'none',
    },
  },
  header: {
    flex: '100%',
    height: 64,
    zIndex: 1250,
  },
  footer: {
    flex: '100%',
    zIndex: 2,
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
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      '& h3': {
        marginTop: 0,
      },
    },
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
        cursor: 'pointer',
      },
    },
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
      '& span': {
        marginLeft: theme.spacing(4),
      },
    },
  },
  boxHeader: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiCollapse-container': {
      marginTop: theme.spacing(2),
    },
  },
  textAlignReadMore: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'inherit !important',
    },
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
})
