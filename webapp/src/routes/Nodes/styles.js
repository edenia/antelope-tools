export default (theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
  },
  card: {
    width: '100%',
    display: 'flex',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'center',
      flex: 'content',
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'auto',
    },
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
})
