export default (theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    gap: theme.spacing(2),    
  },
  card: {
    display: 'flex',
    flexGrow: '1',
    flexFlow: 'row wrap',
    gap: 0,
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
  statsText: {
    textAlign: 'center',
    marginTop: `${theme.spacing(6)} !important`,
  },
  statsContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    borderBottom: '1px solid #e0e0e0',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'row wrap',
    },
  },
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
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
  rewardsCards: {
    minHeight: '125px',
    padding: theme.spacing(2),
  },
  account: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    [theme.breakpoints.down('sm')]: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    },
  },
  content: {
    width: '250px',
    height: 'auto',
    margin: '0px',
    flexGrow: '1',
    [theme.breakpoints.down('lg')]: {
      width: '150px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '350px',
    },
  },
  website: {
    display: 'flex',
  },
  borderLine: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
      padding: theme.spacing(0, 3, 0),
    },
  },
  hideRewards: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiTypography-overline': {
        display: 'none',
      },
    },
  },
})
