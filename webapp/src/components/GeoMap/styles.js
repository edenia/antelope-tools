export default (theme) => ({
  mapWrapper: {
    marginTop: theme.spacing(3),
  },
  goBackBtnHidden: {
    display: 'none !important',
  },
  divRef: {
    height: '100vh',
    '& a': {
      color: theme.palette.primary.main
    },
    '& .highcharts-label': {
      opacity: '1 !important',
    }
  },
})
