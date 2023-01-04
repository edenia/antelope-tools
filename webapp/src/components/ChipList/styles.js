export default (theme) => ({
  chipsContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
  },
  shortList: {
    maxWidth: '250px',
  },
  longList: {
    maxWidth: '600px',
    paddingTop: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
    marginLeft: `-${theme.spacing(0.5)}`,
  },
  bold: {
    fontWeight: 'bold',
  },
})
