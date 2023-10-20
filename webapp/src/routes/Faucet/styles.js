export default (theme) => ({
  formControl: {
    margin: theme.spacing(6, 4, 4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    minHeight: '150px',
    justifyContent: 'center',
    '& .MuiFormControl-root': {
      width: '300px',
    },
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
      height: '100% !important',
    },
    marginBottom: theme.spacing(4),
    gap: theme.spacing(4),
  },
  card: {
    height: '100%',
  },
})
