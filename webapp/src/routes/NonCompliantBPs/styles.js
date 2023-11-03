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
    [theme.breakpoints.down('md')]: {
      flexFlow: 'row wrap',
      gap: theme.spacing(2),
    },
  },
  verticallyCenter: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      minWidth: '150px',
      minHeight: '55px',
    }
  },
})
