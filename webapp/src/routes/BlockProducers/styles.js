export default (theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
  },
  card: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'auto',
      width: '100%',
    },
  },
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    '& .MuiGrid-root': {
      paddingTop: '0px !important',
    },
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    width: '100%',
  },
  cardShadow: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
  },
})
