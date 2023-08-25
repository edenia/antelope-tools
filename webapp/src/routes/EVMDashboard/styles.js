export default (theme) => ({
  container: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    gap: '10px',
  },
  column: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  },
  cardsContainer: {
    flexWrap: 'wrap',
  },
  chartsContainer: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  },
})
