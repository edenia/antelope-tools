export default (theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(4),
      justifyContent: 'space-between',
    },
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    '& .MuiGrid-root': {
      paddingTop: '0px !important',
    },
  },
})
