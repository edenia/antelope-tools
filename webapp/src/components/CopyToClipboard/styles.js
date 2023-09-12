export default (theme) => ({
  icon: {
    alignSelf: 'center',
    marginBottom: `${theme.spacing(2)} !important`,
  },
  tooltip: {
    maxWidth: '150px',
    textAlign: 'center',
    '& .MuiTooltip-tooltip': {
      fontSize: '0.8em !important',
    },
  },
})
