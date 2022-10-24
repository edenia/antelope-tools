export default (theme) => ({
  titleContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dateContainer: {
    flex: '40%',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalContainer: {
    display: 'flex',
    alignSelf: 'center',
    margin: theme.spacing(4),
  },
  select: {
    minWidth: 150,
  },
  pagination: {
    display: 'flex',
    padding: theme.spacing(4),
    justifyContent: 'center',
  },
  cardShadow: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
  },
})
