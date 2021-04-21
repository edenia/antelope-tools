export default (theme) => ({
  wrapper: {
    padding: `${theme.spacing(1) / 4}px ${theme.spacing(4)}px`,
    background: theme.palette.common.white,
    position: 'relative'
  },
  listItem: {
    display: 'inline-block',
    width: 'auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&, &:hover, &:active': {
      color: theme.palette.common.black
    },
    '& a': {
      color: theme.sidebar.footer.color,
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '0.1px',
      textDecoration: 'none'
    }
  }
})
