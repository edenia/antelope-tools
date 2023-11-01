export default (theme) => ({
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  emptyStateContainer: {
    '& span': {
      width: '16em',
      height: '45px',
      fontSize: '1em',
      fontWeight: 'bold',
      fontStretch: 'normal',
      fontStyle: 'normal',
      letterSpacing: '-0.22px',
      textAlign: 'center',
      color: theme.palette.neutral.darker,
    },
  },
  emptyStateRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      color: theme.palette.error.light,
    },
    '& span': {
      margin: theme.spacing(1, 4, 0),
    },
  },
  imgError: {
    [theme.breakpoints.down('lg')]: {
      width: '200px',
      height: '120px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '260px',
      height: '160px',
    },
    objectFit: 'contain',
  },
})
