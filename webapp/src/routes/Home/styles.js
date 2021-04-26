export default (theme) => ({
  leftColumn: {
    alignContent: 'space-between',
    paddingRight: 0,
    '& .MuiCard-root': {
      height: 125,
      marginBottom: theme.spacing(2),
      '& .MuiTypography-body1': {
        marginBottom: theme.spacing(2)
      }
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(2)
    }
  },
  rightColumn: {
    paddingLeft: 0,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2)
    }
  },
  bottomRow: {
    paddingTop: 0,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(1)
    }
  },
  boxIrreversible: {
    display: 'flex',
    alignItems: 'baseline',
    paddingTop: theme.spacing(3),
    '& .MuiTypography-body1': {
      marginBottom: '0 !important',
      letterSpacing: '0.09px',
      color: 'rgba(0, 0, 0, 0.54)',
      '& strong': {
        color: '#212121'
      }
    }
  },
  pauseButton: {
    display: 'flex',
    width: 75,
    height: 24
  },
  headerTransactionLine: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'baseline',
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row'
    }
  },
  formControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 187
    }
  }
})
