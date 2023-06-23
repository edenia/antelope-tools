export default (theme) => ({
    svgLink: {
      fontSize: 18,
      marginLeft: theme.spacing(2),
    },
    lowercase: {
      textTransform: 'lowercase !important',
    },
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
