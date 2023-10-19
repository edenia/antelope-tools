export default (theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.palette.shadows.producerChart,
  },
  description: {
    fontWeight: 'normal',
  },
  chartContainer:{
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
  }
})
