export default (theme) => ({
  statsText: {
    textAlign: 'center',
  },
  price: {
    paddingBottom: theme.spacing(2),
  },
  statsContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    gap: theme.spacing(6),
    margin: theme.spacing(6, 0, 4),
    paddingBottom: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'row wrap',
      gap: theme.spacing(2),
    },
  },
  verticallyCenter: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      minWidth: '150px',
      minHeight: '55px',
    }
  },
})
