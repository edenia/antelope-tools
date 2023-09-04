export default (theme) => ({
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
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
    margin: `${theme.spacing(6)} 24px ${theme.spacing(4)}`,
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
    height: '100%',
    minHeight: '125px',
    padding: theme.spacing(4),
    '& h2': {
      fontWeight: 'bold',
    },
  },
  verticallyCenter: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardHeader: {
    width: '100px',
    height: 'auto',
    margin: '0px',
    flexGrow: '1',
    background: theme.palette.common.white,
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '200px',
    },
  },
  bpsContainer: {
    display: 'grid',
    gap: theme.spacing(4, 6),
    gridTemplateColumns:
      'repeat(auto-fit, minmax( min( calc( 50% - 100px ), 600px ), auto))',
    margin: '0 24px',
    [theme.breakpoints.down('lg')]: {
      margin: '0',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, auto))',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, auto))',
    },
  },
  card: {
    display: 'flex',
    flexFlow: 'row nowrap',
    minHeight: '125px',
    padding: theme.spacing(2),
    background: theme.palette.common.white,
    borderRadius: theme.spacing(1),
    '& .MuiTypography-h6': {
      display: 'flex',
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
