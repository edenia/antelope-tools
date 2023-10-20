export default (theme) => ({
  paper: {
    border: `1px solid ${theme.palette.neutral.light}`,
  },
  popover: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  popoverClose: {
    textAlign: 'right',
    position: 'sticky',
    paddingTop: theme.spacing(2),
    top: 0,
  },
  popoverCloseIcon: {
    cursor: 'pointer',
  },
})
