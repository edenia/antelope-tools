export default (theme) => ({
  graphicBox: {
    '& .MuiCard-root': {
      height: '100%',
    },
    display: 'flex',
    marginBottom: '10px',
    gap: '10px',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  bottomRow: {
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(1),
    },
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
        color: '#212121',
      },
    },
  },
  pauseButton: {
    display: 'flex',
    width: 75,
    height: 24,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  disableButton: {
    color: theme.palette.action.disabled,
  },
  headerTransactionLine: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'baseline',
    padding: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
  },
  formControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    '& .MuiFormControl-root': {
      width: 200,
    },
    [theme.breakpoints.up('lg')]: {
      width: 300,
    },
  },
  cards: {
    textTransform: 'capitalize',
    '& .MuiTypography-h6': {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: theme.spacing(2),
    },
  },
  cardLink: {
    fontSize: 15,
    marginBottom: 2,
  },
  svgLink: {
    fontSize: 18,
    marginLeft: theme.spacing(2),
  },
  lowercase: {
    textTransform: 'lowercase !important',
  },
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
  divMargin: {
    display: 'flex',
    marginBottom: '10px',
    gap: '10px',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  cardHeader: {
    flexGrow: '1',
    flexBasis: 'calc(100%/5)',
    [theme.breakpoints.down('md')]: {
      marginBottom: '10px',
    },
  },
  cardGrow: {
    flexGrow: '1',
    flexBasis: 'calc(100%/5)',
    [theme.breakpoints.down('md')]: {
      flexBasis: 'calc(100%/3)',
      marginBottom: '10px',
    },
  },
  divTrans: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginBottom: '10px',
    },
  },
  wrapper: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginBottom: '10px',
    },
  },
})
