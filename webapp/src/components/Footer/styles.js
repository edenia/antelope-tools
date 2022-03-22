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
  },
  sidebarFooter: {
    backgroundColor: `${theme.sidebar.footer.background} !important`,
    padding: theme.spacing(2.75, 4),
    minHeight: 61,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sidebarFooterText: {
    color: theme.sidebar.footer.color,
    fontSize: 14,
    lineHeight: '20px',
    textAlign: 'center',
    letterSpacing: '0.1px'
  },
  sidebarFooterSubText: {
    color: theme.sidebar.footer.color,
    fontSize: '0.725rem',
    display: 'block',
    padding: 1
  },
  footerBoxLink: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& a': {
      color: theme.sidebar.footer.color,
      fontSize: 14,
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '0.1px',
      textDecoration: 'none',
      marginTop: 3
    }
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  footerImg: {
    width: 24,
    marginRight: theme.spacing(1)
  }
})
