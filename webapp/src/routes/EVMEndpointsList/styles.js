export default (theme) => ({
  cardShadow: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
  },
  healthContainer: {
    display: 'flex',
    maxWidth: '300px',
    justifyContent: 'space-between',
  },
  titleContainer: {
    display: 'flex',
    gap: theme.spacing(4),
    alignItems: 'center',
  },
  buttonContainer: {
    padding: '0 0 0 25%',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      padding: 0,
    },
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiTableContainer-root': {
      width: '80%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.up('lg')]: {
        width: '50%',
      }
    },
  },
})
