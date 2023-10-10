export default (theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2, 0, 2),
  },
  nodesContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  hideOnMobile: {
    [theme.breakpoints.down('md')]: {
      display: 'none !important',
    },
  },
  hideOnDesktop: {
    [theme.breakpoints.up('md')]: {
      display: 'none !important',
    },
  },
  cardRow: {
    display: 'grid',
    gridTemplateColumns: '60px 240px 4fr',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  nodesRow: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      margin: 0,
      flexGrow: 1,
      width: 'auto',
    },
    '&:hover': {
      backgroundColor: '#f0f3fa',
    },
  },
  columnsContainer: {
    height: '50px',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
})
