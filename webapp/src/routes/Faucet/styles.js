export default (theme) => ({
  formControl: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  test: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  card: {
    padding: '10px',
    height: '100%',
    '& .MuiPaper-root': {
      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
    }
  },
})
