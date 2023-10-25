export default (theme) => ({
  wrapper: {
    display: 'flex',
    flexBasis: 'auto',
    flexWrap: 'wrap',
    padding: `1px ${theme.spacing(1)}`,
    background: theme.palette.background.default,
    alignItems: 'center',
    boxShadow: theme.palette.shadows.card,
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  listItem: {
    display: 'inline-block',
    width: 'auto !important',
    paddingLeft: `${theme.spacing(2)} !important`,
    paddingRight: `${theme.spacing(2)} !important`,
    '&, &:hover, &:active': {
      color: theme.palette.common.black,
    },
    '& a': {
      color: theme.palette.neutral.dark,
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '0.1px',
      textDecoration: 'none',
    },
    [theme.breakpoints.down('md')]: {
      textAlign: 'center !important',
      paddingTop: '0px !important',
      paddingBottom: '0px !important',
    },
  },
  sidebarFooter: {
    padding: theme.spacing(2.75, 4),
    minHeight: 61,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarFooterText: {
    lineHeight: '20px',
    textAlign: 'center',
    letterSpacing: '0.1px',
    display: 'flex !important',
    justifyContent: 'center !important',
  },
  sidebarFooterSubText: {
    fontSize: '0.725rem',
    display: 'block',
    padding: 1,
  },
  footerBoxLink: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& a': {
      fontSize: 14,
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '0.1px',
      textDecoration: 'none',
      marginTop: 3,
    },
  },
  gridFooter: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      order: 3,
      paddingBottom: '15px',
    },
  },
  footerImg: {
    width: 24,
    marginRight: theme.spacing(1),
  },
  footerMenuWrapper: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  linkBadge: {
    fontSize: '11px !important',
    fontWeight: theme.typography.fontWeightBold,
    height: '20px !important',
    alignItems: 'center',
    padding: '2px 6px',
    color: theme.palette.primary.contrastText,
    justifyContent: 'center',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor: `${theme.palette.primary.main} !important`,
    '& span.MuiChip-label, & span.MuiChip-label:hover': {
      cursor: 'pointer',
      color: theme.palette.background.default,
      paddingleft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  footerAlign: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: 0,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      order: 2,
    },
  },
  left: {
    flexGrow: 1,
    flexBasis: 0,
  },
  noUnderline: {
    textDecoration: 'none !important',
  },
  lineFooter: {
    textDecoration: 'underline !important',
  },
  midFooter: {
    display: 'flex',
    justifyContent: 'center',
  },
  imgHeaderLogo: {
    width: '18px',
    height: '18px',
    marginLeft: theme.spacing(1),
    marginTop: '2px',
  },
})
