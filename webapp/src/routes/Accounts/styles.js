export default (theme) => ({
  field: {
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  alert: {
    marginBottom: theme.spacing(2)
  },
  title: {
    fontSize: '17px !important',
    fontWeight: '600 !important',
    lineHeight: '1.2 !important !important',
    letterSpacing: '0.06px',
    textAlign: 'left !important',
    marginBottom: `${theme.spacing(2)} !important`
  },
  searchWrapper: {
    '& .MuiPaper-root':{
      boxShadow: 'none',
      padding: 0,
    }
  }
})
