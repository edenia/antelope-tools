export default (theme) => ({
  chart: {
    '& .highcharts-background,.highcharts-tooltip-box': {
      fill: theme.palette.background.default,
    },
    '& .highcharts-title,.highcharts-legend-item text,.highcharts-axis-title,.highcharts-axis-labels text,.highcharts-data-label text,.highcharts-tooltip text':
      {
        fill: `${theme.palette.text.primary} !important`,
      },
    '& .highcharts-legend-item-hidden text': {
      fill: `${theme.palette.neutral.light} !important`,
    },
  },
})
