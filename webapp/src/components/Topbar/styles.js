export default (theme) => ({
  sessionText: {
    marginLeft: 5,
    color: theme.palette.primary.contrastText,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline'
    }
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1
  }
})
