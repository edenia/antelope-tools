export default (theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: `1px ${theme.spacing(4)}`,
    background: theme.palette.common.white,
    position: 'relative',
    alignItems: 'stretch'
    
  },  
  btnLogin: {
    textTransform: 'capitalize !important',
    fontWeight: '600 !important'
  },
  btnLanguage: {
    fontWeight: '600 !important'
  },
  imgHeaderLogo: {
    width: '120px',
    marginLeft: '15px',
  },
  appBar: {
    backgroundColor: '#fff !important',
    color: theme.header.color,
    boxShadow: theme.shadows[1]
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
    float: 'right',
    justifyContent: 'center',
    alignItems: 'center',
    '& button': {
      color: '#757575'
    }
  }
})
