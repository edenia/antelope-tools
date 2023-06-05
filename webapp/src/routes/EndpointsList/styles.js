export default (theme) => ({
  titleContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dateContainer: {
    flex: '50%',
    display: 'flex',
    flexDirection: 'column',
    '& div': {
      gap: theme.spacing(2),
      margin: theme.spacing(2, 0, 2),
    },
  },
  controlFormContainer: {
    display: 'flex',
    flexWrap: 'wrap',
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
  searchWrapper: {
    flex: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& .MuiGrid-root': {
      paddingTop: '0px !important',
    },
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
  noShadow: {
    '& .MuiPaper-root':{
      boxShadow: 'none !important'
    }
  }
})
