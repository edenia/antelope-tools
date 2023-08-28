export default (theme) => ({
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
})
