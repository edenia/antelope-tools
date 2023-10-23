export default (theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.palette.shadows.card,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  description: {
    fontWeight: 'normal',
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
  }
})
