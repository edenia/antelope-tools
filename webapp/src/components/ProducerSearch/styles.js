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
    color: '#fff'
  },
  cardContent: {
    padding: `${theme.spacing(2)}px !important`
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '0.06px',
    textAlign: 'left',
    marginBottom: theme.spacing(2)
  }
})
