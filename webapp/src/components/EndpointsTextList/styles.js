export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2, 2),
    whiteSpace: 'pre-line',
    minWidth: '300px',
    '& p': {
      margin: theme.spacing(0, 0, 2, 0),
      fontWeight: 'bold',
      [theme.breakpoints.up('md')]: {
        textAlign: 'center',
      },
    },
  },
})
