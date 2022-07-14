export default (theme) => ({
  btnLogin: {
    textTransform: 'capitalize !important',
    fontWeight: '600 !important'
  },
  btnLanguage: {
    fontWeight: '600 !important'
  },
  imgHeaderLogo: {
    width: '90px',
    marginLeft: '15px'
  },
  appBar: {
    backgroundColor: '#fff !important',
    color: theme.header.color,
    boxShadow: theme.shadows[1]
  },
  iconButton: {
    '& svg': {
      width: 22,
      height: 22
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
