export default (theme) => ({
  paper: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
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
