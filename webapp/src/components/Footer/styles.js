export default (theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: `1px ${theme.spacing(4)}`,
    background: theme.palette.common.white,
    // position: 'relative',
    alignItems: 'stretch',
    boxShadow: '0px 0px 14px rgba(53, 64, 82, 0.25)'

  },
  listItem: {
    display: 'inline-block',
    width: 'auto !important',
    paddingLeft: `${theme.spacing(2)} !important`,
    paddingRight: `${theme.spacing(2)} !important`,
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
    alignItems: 'right'
  },
  sidebarFooterText: {
    color: theme.sidebar.footer.color,
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
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  footerImg: {
    width: 24,
    marginRight: theme.spacing(1)
  },
  footerMenuWrapper: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0
    },

  linkBadge: {
    fontSize: '11px !important',
    fontWeight: theme.typography.fontWeightBold,
    height: '20px !important',
    alignItems: 'center',
    padding: '2px 6px 0px 12px',
    color: '#FFFF',
    justifyContent: 'center',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor: `${theme.palette.secondary.main} !important`,

    '& span.MuiChip-label, & span.MuiChip-label:hover': {
      cursor: 'pointer',
      color: theme.sidebar.badge.color,
      paddingleft: theme.spacing(2),
      paddingRight: theme.spacing(2)
}
    },
    footerAlign: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row'
    }
})
