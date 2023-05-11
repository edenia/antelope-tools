export default (theme) => ({
  updateLogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dateText: {
    fontWeight: 'bold',
    marginRight: theme.spacing(4),
    '& span': {
      fontWeight: 'normal',
    },
  },
})
