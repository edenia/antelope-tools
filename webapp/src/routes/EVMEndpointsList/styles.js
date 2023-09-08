export default (theme) => ({
  cardShadow: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
  },
  healthContainer: {
    display: 'flex',
    width: '300px',
    justifyContent: 'space-between',
  },
  titleContainer: {
    display: 'flex',
    gap: theme.spacing(4),
    alignItems: 'center',
  },
  formContainer: {
    padding: '0 25% 0',
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.breakpoints.down('lg')]: {
      padding: '0 12% 0',
    },
    [theme.breakpoints.down('md')]: {
      padding: 0,
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(4),
    },
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(4),
    },
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '80vh',
    '& .MuiTableContainer-root': {
      width: '80%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.up('lg')]: {
        width: '50%',
      },
    },
  },
})
