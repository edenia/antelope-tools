export default (theme) => ({
    wrapper: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
  })
