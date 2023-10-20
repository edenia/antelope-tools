export default (theme) => ({
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    '& .MuiGrid-root': {
      paddingTop: '0px !important',
    },
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    width: '100%',
  },
})
