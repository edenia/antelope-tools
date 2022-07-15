export default (theme) => ({
  wrapper: {
    padding: theme.spacing(6),
    textAlign: 'center',
    backgroundColor: 'transparent',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(10)
    }
  }
})
