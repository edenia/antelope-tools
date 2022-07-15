export default (theme) => ({
  root: {
    maxWidth: 345,
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  content: {
    flex: 1
  },
  avatar: {
    width: '3em',
    height: '3em',
    borderRadius: '100%',
    backgroundColor: theme.palette.primary.contrastText
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  dt: {
    fontWeight: 'bold'
  },
  social: {
    '& a': {
      display: 'flex'
    },
    '& svg': {
      marginRight: theme.spacing(1)
    }
  },
  action: {
    cursor: 'pointer',
    color: theme.palette.secondary.main,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
})
