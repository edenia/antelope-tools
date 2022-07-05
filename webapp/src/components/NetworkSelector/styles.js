export default (theme) => ({
  dropdown: {
    position: 'relative',
    width: 200,
    marginTop: 35,
    '& img': {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor: theme.palette.primary.contrastText
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
      width: 'auto',
      minWidth: 200
    },
    '&:hover': {
      cursor: 'pointer'
    }
  },
  list: {
    transition: 'max-height .6s ease-out',
    backgroundColor: theme.palette.primary.contrastText,
    maxHeight: 0,
    overflow: 'hidden',
    margin: 0,
    position: 'absolute',
    zIndex: 2,
    padding: 0,
    width: 310,
    top: 48,
    left: -55,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    '& .titles': {
      display: 'flex',
      '& .titlesBoxRight': {
        paddingLeft: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        width: '50%',
        height: 50,
        borderLeft: '1px solid #EEEEEE',
        borderBottom: '1px solid #EEEEEE'
      },
      '& .titlesBoxLeft': {
        paddingLeft: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        height: 50,
        width: '50%',
        borderBottom: '1px solid #EEEEEE'
      },
      '& p': {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: '21px',
        letterSpacing: '0.07875px'
      }
    },
    '& .lists': {
      display: 'flex',
      '& ul': {
        padding: 0,
        margin: 0
      },
      '& .listsBoxRight': {
        width: '50%',
        borderLeft: '1px solid #EEEEEE'
      },
      '& .listsBoxLeft': {
        width: '50%'
      }
    },
    [theme.breakpoints.up('sm')]: {
      left: -189,
      width: 320
    }
  },
  listActive: {
    maxHeight: 1000,
    opacity: 1
  },
  listItem: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    listStyle: 'none',
    paddingLeft: theme.spacing(2),
    background: theme.palette.primary.contrastText,
    '& a': {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: theme.palette.common.black
    },
    '&:hover': {
      background: '#f4f4f4'
    }
  },
  listItemActive: {
    background: theme.palette.primary.contrastText
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: theme.spacing(2),
    color: theme.palette.common.black,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 22,
      borderRadius: theme.spacing(2, 4, 4, 2),
      justifyContent: 'flex-start',
      marginRight: 65
    }
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
    right: 70,
    top: -45,
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      right: 0,
      top: -3
    }
  },
  expandIcon: {
    marginTop: theme.spacing(1),
    marginRight: 0,
    color: theme.palette.text.hint
  },
  jungleImg: {
    width: '15px !important',
    height: '22px !important',
    marginRight: theme.spacing(2)
  },
  telosImg: {
    width: '15px !important',
    height: '15px !important',
    marginRight: theme.spacing(2)
  },
  waxImg: {
    width: '21px !important',
    height: '21px !important',
    marginRight: theme.spacing(2)
  },
  lacchainImg: {
    width: '24px !important',
    height: '24px !important',
    marginRight: theme.spacing(2)
  },
  protonImg: {
    width: '16px !important',
    height: '16px !important',
    marginRight: theme.spacing(2)
  },
  eosImg: {
    width: '24px !important',
    height: '24px !important',
    marginRight: theme.spacing(1),
    marginLeft: -3
  },
  airwireImg: {
    width: '24px !important',
    height: '24px !important',
    marginRight: theme.spacing(2)
  },
  libreImg: {
    width: '24px !important',
    height: '24px !important',
    marginRight: theme.spacing(2)
  },
  ultraImg: {
    width: '24px !important',
    height: '24px !important',
    marginRight: theme.spacing(2)
  }
})