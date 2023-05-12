export default (theme) => ({
  wrapper: {
    flexDirection: 'row',
    padding: `1px ${theme.spacing(4)}`,
    background: theme.palette.common.white,
    position: 'relative',
    alignItems: 'stretch',
  },
  btnLanguage: {
    fontWeight: '600 !important',
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto !important',
      width: '36px',
      '& .MuiButton-startIcon': {
        margin: '0 !important',
      }
    },
  },
  mobileHidden: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  imgHeaderLogo: {
    width: '145px',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  appBar: {
    backgroundColor: '#fff !important',
    color: theme.header.color,
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    height: '100%',
  },
  iconButton: {
    '& svg': {
      width: 22,
      height: 22,
      color: 'rgba(0, 0, 0, 0.54)',
    },
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    '& button': {
      color: '#757575',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '250px',
      gap: 0,
      justifyContent: 'space-between',
    }
  },
  accountContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: '16px !important',
    textAlign: 'center',
    letterSpacing: '1px !important',
    padding: theme.spacing(0, 2, 0),
    '& span': {
      paddingLeft: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
      },
    }
  },
  iconsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  menuBox: {
    '& .MuiPaper-root': {
      padding: theme.spacing(1),
    },
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: '6px',
    width: '100%',
    transition: 'all 0.3s ease 0s',
    padding: theme.spacing(0, 1),
    margin: theme.spacing(1, 0),
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(1)',
    },
  },
  iconText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& img': {
      marginRight: theme.spacing(1),
    },
  },
  loginBtn: {
    color: 'white !important',
    cursor: 'pointer',
  },
  logoutContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
    borderLeft: '0.8px solid white',
  },
  userBtn: {
    textTransform: 'lowercase !important',
  },
  accountName: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      marginRight: theme.spacing(1),
    },
  },
  authBox: { 
    display: 'flex', 
    alignItems: 'center', 
    textAlign: 'center',
    background: '#1675CA',
    borderRadius: '10px',
    transition: 'ease-in-out background 2s',
    '&:hover': {
      background: 'rgb(22, 117, 202, 0.8)',
    }
  },
  cardShadow: {
    '& .MuiPaper-root': {
      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
    },
  },
})
