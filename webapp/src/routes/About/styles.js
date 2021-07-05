export default (theme) => ({
  boxInfo: {
    '& p': {
      fontSize: 14,
      lineHeight: '21px',
      letterSpacing: '0.07875px'
    },
    '& h4': {
      fontWeight: '600',
      fontSize: 20,
      lineHeight: '24px',
      textAlign: 'justify',
      marginBottom: theme.spacing(4)
    }
  },
  logo: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 569,
      height: 498
    }
  }
})
