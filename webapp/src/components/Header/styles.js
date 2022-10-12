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
    fontWeight: '600 !important',
  },
  btnLanguage: {
    fontWeight: '600 !important',
  },
  imgHeaderLogo: {
    width: '145px',
    marginTop: '5px',
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
    '& button': {
      color: '#757575',
    },
  },
  iconsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
})
