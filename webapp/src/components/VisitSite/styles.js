export default (theme) => ({
  link: {
    width: '24px',
    height: '24px',
    alignSelf: 'center',
    marginLeft: theme.spacing(3),
  },
  clickableIcon: {
    color: 'black',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
})
