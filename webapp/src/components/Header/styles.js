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
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto !important',
      width: '50px',
      '& .MuiButton-startIcon': {
        margin: '0 !important',
      },
    },
  },
  imgHeaderLogo: {
    '& svg': {
      height: '64px',
      width: '145px',
      marginTop: theme.spacing(2),
      color: theme.palette.text.primary,
      [theme.breakpoints.down('sm')]: {
        width: '70%',
        marginLeft: theme.spacing(2.5),
      },
    },
  },
  appBar: {
    height: '100%',
  },
  iconButton: {
    '& svg': {
      width: 22,
      height: 22,
      color: theme.palette.neutral.darker,
    },
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    '& button': {
      color: theme.palette.neutral.dark,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '250px',
      justifyContent: 'end',
    },
  },
  accountContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: `${theme.spacing(2)} !important`,
    textAlign: 'center',
    letterSpacing: '1px !important',
    padding: theme.spacing(0, 2, 0),
    [theme.breakpoints.down('sm')]: {
      padding: '0 4px 0',
    },
    '& span': {
      paddingLeft: theme.spacing(1),
      fontSize: '1rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
      },
    },
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
    cursor: 'pointer',
  },
  connectWalletBtn: {
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(2, 1, 2, 1)} !important`,
    },
  },
  logoutContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
    border: `0 solid ${theme.palette.primary.contrastText}`,
    borderLeft: `0.8px solid ${theme.palette.primary.contrastText}`,
    background: 'transparent',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1, 2, 1),
    },
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
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '10px',
    transition: 'ease-in-out all 0.5s',
    '&:hover': {
      boxShadow: theme.palette.shadows.authBox,
    },
    '& button': {
      color: theme.palette.primary.contrastText,
    },
  },
  hiddenlanguageMenu: {
    width: 0,
    height: 0,
    '& > div': {
      maxHeight: 0,
      margin: 0,
      zIndex: 2,
      width: 0,
      position: 'relative',
      padding: '0 !important',
      transition: 'none !important',
      overflow: 'hidden !important',
      boxShadow: 'none !important',
    },
  },
  languageMenu: {
    '& > div': {
      maxWidth: 80,
      width: 80,
      maxHeight: 1000,
      opacity: 1,
      top: 25,
      left: 'calc(100% - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: `${theme.palette.shadows.card} !important`,
    },
  },
  hideElement: {
    height: 0,
    width: 0,
    display: 'none',
  },
  popOverBackground: {
    display: 'initial',
    width: '100%',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
})
