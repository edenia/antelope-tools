export default (theme) => ({
  responsiveContainerWrapper: {
    '& .recharts-tooltip': {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: '500',
      color: '#fff',
      backgroundColor: '#616161',
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2)
    },
    '& .recharts-tooltip-label': {
      margin: 0
    },
    '& .recharts-tooltip-list': {
      margin: 0,
      padding: 0
    },
    '& .recharts-tooltip-list-item': {}
  }
})
