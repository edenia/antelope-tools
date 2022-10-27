export default (theme) => ({
  alert: {
    '& a': {
      color: theme.palette.info.contrastText,
      lineBreak: 'anywhere',
    }
  },
  errMsg: {
    width: '50%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end'
  }
})
