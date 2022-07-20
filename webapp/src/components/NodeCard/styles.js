export default (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  content: {
    flex: 1
  },
  avatar: {
    borderRadius: '100%',
    backgroundColor: theme.palette.primary.contrastText
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  bold: {
    fontWeight: 'bold'
  },
  breakLine: {
    wordBreak: 'break-word'
  }
})
