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
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
})
