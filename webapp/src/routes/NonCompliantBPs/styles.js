export default (theme) => ({
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
  statsText: {
    textAlign: 'center',
    marginTop: `${theme.spacing(6)} !important`,
  },
  statsContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    gap: theme.spacing(6),
    margin: `${theme.spacing(6)} 40px ${theme.spacing(4)}`,
    paddingBottom: theme.spacing(4),
    borderBottom: '1px solid #e0e0e0',
    [theme.breakpoints.down('lg')]: {
      margin: theme.spacing(6, 0, 4),
    },
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'row wrap',
    },
  },
  rewardsCards: {
    minHeight: '125px',
    padding: theme.spacing(4),
  },
  cardHeader: {
    width: '100px',
    height: 'auto',
    margin: '0px',
    flexGrow: '1',
    [theme.breakpoints.down('sm')]: {
      width: '200px',
    },
  },
  bpsContainer: {
    display: 'grid',
    gap: theme.spacing(4, 6),
    gridTemplateColumns: 'repeat(auto-fit, minmax(800px, auto))',
    margin: '0 40px',
    [theme.breakpoints.down('lg')]: {
      margin: '0',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, auto))',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  },
  card: {
    display: 'flex',
    flexFlow: 'row nowrap',
    minHeight: '125px',
    padding: theme.spacing(2),
    '& .MuiTypography-h6': {
      display: 'flex',
    },
    '& .MuiTypography-overline': {
      marginLeft: 0,
      fontWeight: '700',
    },
    '& .MuiTypography-body1': {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'auto',
      flexDirection: 'column',
      padding: theme.spacing(3),
    },
  },
})
