export default (theme) => ({
  boxInfo: {
    '& p': {
      fontSize: 14,
      lineHeight: '21px',
      letterSpacing: '0.07875px',
    },
    '& h4': {
      fontWeight: '600',
      fontSize: 20,
      lineHeight: '24px',
      textAlign: 'justify',
      marginBottom: theme.spacing(4),
    },
  },
  logoContainer: {
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },
  logo: {
    width: 569,
    height: 498,
    float: 'right',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  cardShadow: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
  },
  mainText: {
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
})
