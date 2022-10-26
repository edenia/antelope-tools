export default (theme) => ({
  mapWrapper: {
    backgroundColor: theme.palette.common.white,
    marginTop: theme.spacing(3),
  },
  goBackBtnHidden: {
    display: 'none !important'
  },
  goBackBtn: {
    display: 'flex',
    marginLeft: theme.spacing(1)
  },
  divRef: {
    height: '100vh',
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',

  }
})
