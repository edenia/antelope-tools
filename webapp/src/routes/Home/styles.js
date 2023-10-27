export default (theme) => ({
  graphicBox: {
    display: 'flex',
    marginBottom: '10px',
    gap: '10px',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  divMargin: {
    display: 'flex',
    marginBottom: '10px',
    gap: '10px',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  divTrans: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginBottom: '10px',
    },
    '& > .MuiCard-root': {
      height: '100%',
      '& :nth-child(2)': {
        [theme.breakpoints.up('lg')]: {
          position: 'relative',
          top: 'calc(50% - 232px)',
        },
      }
    }
  },
})
