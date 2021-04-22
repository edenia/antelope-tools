export default (theme, rgba) => ({
  drawer: {
    borderRight: 0,
    '& > div': {
      borderRight: 0
    }
  },
  scrollbar: {
    backgroundColor: theme.sidebar.background
  },
  list: {
    backgroundColor: theme.sidebar.background
  },
  listItem: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center'
  },
  brand: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.sidebar.header.color,
    backgroundColor: theme.sidebar.header.background,
    fontFamily: theme.typography.fontFamily,
    minHeight: 56,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    cursor: 'default',
    paddingBottom: 16,
    [theme.breakpoints.up('sm')]: {
      minHeight: 64
    },
    '&:hover': {
      backgroundColor: theme.sidebar.header.background
    }
  },
  brandIcon: {
    marginRight: theme.spacing(2),
    color: theme.sidebar.header.brand.color
  },
  categoryText: {
    margin: 0,
    '& span': {
      color: theme.sidebar.color,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.sidebar.category.fontWeight,
      padding: theme.spacing(0, 4)
    }
  },
  categoryIconLess: {
    color: rgba(theme.sidebar.color, 0.5)
  },
  categoryIconMore: {
    color: rgba(theme.sidebar.color, 0.5)
  },
  linkText: {
    color: theme.sidebar.color,
    '& span': {
      fontSize: theme.typography.body1.fontSize
    },
    marginTop: 0,
    marginBottom: 0
  },
  linkBadge: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeightBold,
    height: 20,
    position: 'absolute',
    right: 12,
    top: 8,
    backgroundColor: theme.palette.secondary.main,

    '& span.MuiChip-label, & span.MuiChip-label:hover': {
      cursor: 'pointer',
      color: theme.sidebar.badge.color,
      paddingleft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  categoryBadge: {
    top: 12
  },
  sidebarSection: {
    color: theme.sidebar.color,
    padding: theme.spacing(4, 6, 1),
    opacity: 0.9,
    display: 'block',
    fontWeight: '600'
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
    justifyContent: 'center',
    '& a': {
      color: theme.sidebar.footer.color,
      fontSize: 14,
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '0.1px',
      textDecoration: 'none',
      marginTop: 3
    },
    '& svg': {
      marginRight: theme.spacing(1)
    }
  }
})
