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
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    [theme.breakpoints.up('lg')]: {
      alignItems: 'center',
    },
    '& .MuiInputLabel-formControl': {
      position: 'relative',
      marginBottom: `-${theme.spacing(2)}`,
    },
  },
})
