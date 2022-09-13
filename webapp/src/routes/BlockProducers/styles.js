export default (theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
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
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    width: '100%',
  },
})
