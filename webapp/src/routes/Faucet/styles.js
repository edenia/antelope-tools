export default (theme) => ({
  formControl: {
    margin: theme.spacing(2),
  },
  test: {
    display: 'flex',

    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  card: {
    padding: '10px',
  },
  button: {
    marginTop: '16px',
  },
})
