export default (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(2),
  },
  card: {
    width: '100%',
    flex: 'content',
  },
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  formControl: {
    width: '100%',
  },
})
