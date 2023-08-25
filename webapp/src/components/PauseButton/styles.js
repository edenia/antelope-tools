export default (theme) => ({
  pauseButton: {
    display: 'flex',
    width: 75,
    height: 24,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  disableButton: {
    color: theme.palette.action.disabled,
  },
})
