export default (theme) => ({
  formControl: {
    width: '100%'
  },
  chipWrapper: {
    marginTop: theme.spacing(2),
    '& .MuiChip-root': {
      marginRight: theme.spacing(2)
    },
    textTransform: 'capitalize'
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.common.white} !important`
  },
  cardContent: {
    padding: `${theme.spacing(2)} !important`
  },
  title: {
    fontSize: '17px !important',
    fontWeight: '600 !important',
    lineHeight: '1.2 !important !important',
    letterSpacing: '0.06px',
    textAlign: 'left !important',
    marginBottom: `${theme.spacing(2)} !important`
  }
})
