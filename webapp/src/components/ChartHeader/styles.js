export default (theme) => ({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'baseline',
    minHeight: '60px',
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
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
    [theme.breakpoints.down('lg')]: {
      marginTop: theme.spacing(3),
    },
  },
  onlySelect: {
    width: 150,
  }
})
