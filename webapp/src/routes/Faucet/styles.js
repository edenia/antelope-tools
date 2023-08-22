export default (theme) => ({
  formControl: {
    margin: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    minHeight: '150px',
    justifyContent: 'center',
    '& .MuiFormControl-root': {
      width: '300px',
    },
  },
  test: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
      height: '100% !important',
    },
    marginBottom: theme.spacing(4),
  },
  card: {
    padding: '10px',
    height: '100%',
    '& .MuiPaper-root': {
      height: '100%',
      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
    },
  },
})
