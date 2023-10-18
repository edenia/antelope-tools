export default (theme) => ({
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    '& .MuiGrid-root': {
      paddingTop: '0px !important',
    },
    '& .MuiPaper-root': {
      boxShadow: 'none !important',
      padding: 0,
    },
  },
})
