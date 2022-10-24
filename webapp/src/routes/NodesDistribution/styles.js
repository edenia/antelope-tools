export default (theme) => ({
  cardShadow: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
  },
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    '& .MuiGrid-root': {
      paddingTop: '0px !important',
    },
  },
})
