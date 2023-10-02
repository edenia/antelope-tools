export default (theme) => ({
  country: {
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    '& .flag-icon': {
      borderRadius: '50%',
      width: '24px !important',
      height: '24px !important',
      top: '-5px',
    },
  },
})
