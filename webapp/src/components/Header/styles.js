export default (theme) => ({
  wrapper: {
    flexDirection: 'row',
    padding: `1px ${theme.spacing(4)}`,
    background: theme.palette.common.white,
    position: 'relative',
    alignItems: 'stretch',

  },
  btnLogin: {
    textTransform: 'capitalize !important',
    fontWeight: '600 !important'
  },
  btnLanguage: {
    fontWeight: '600 !important'
  },
  imgHeaderLogo: {
    width: '104px',
    height: '45px',

  },
  appBar: {
    backgroundColor: '#fff !important',
    color: theme.header.color,
    boxShadow: '0px 0px 14px rgba(53, 64, 82, 0.25) !important',
    height: 64
  },
  iconButton: {
    '& svg': {
      width: 22,
      height: 22,
      color: 'rgba(0, 0, 0, 0.54)'
    }
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      color: '#757575'
    }
  },
  iconsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
})
