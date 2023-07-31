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
    '& .MuiInputLabel-formControl': {
      position: 'relative',
      marginBottom: `-${theme.spacing(2)}`,
    },
    [theme.breakpoints.up('lg')]: {
      width: 300,
    },
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
  divTrans: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginBottom: '10px',
    },
  },
})
