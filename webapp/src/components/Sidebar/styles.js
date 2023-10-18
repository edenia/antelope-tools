export default (theme, rgba) => ({
  drawer: {
    minWidth: '70px',
    borderRight: 0,
    height: '100%',
    backgroundColor: theme.palette.background.default,
    '& > div': {
      minWidth: '70px',
      borderRight: 0,
      [theme.breakpoints.up('md')]: {
        maxWidth: '240px',
        position: 'sticky !important',
        height: 'auto',
      },
    },
  },
  scrollbar: {
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(4),
  },
  list: {
    backgroundColor: theme.palette.background.default,
  },
  listItem: {
    padding: '2px 6px 2px 6px !important',
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'start !important',
    justifyContent: 'center !important',
    cursor: 'pointer'
  },
  brand: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.neutral.light,
    backgroundColor: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,
    minHeight: 56,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    cursor: 'default',
    paddingBottom: 16,
    [theme.breakpoints.up('sm')]: {
      minHeight: 64,
    },
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
  brandIcon: {
    width: 200,
    height: 100,
  },
  airWareIcon: {
    width: 200,
    height: 50,
    margin: '25px 0',
  },
  categoryText: {
    margin: 0,
    '& span': {
      color: theme.palette.neutral.darker,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: 400,
      padding: theme.spacing(0, 4),
    },
  },
  categoryIconLess: {
    color: rgba(theme.palette.neutral.darker, 0.5),
  },
  categoryIconMore: {
    color: rgba(theme.palette.neutral.darker, 0.5),
  },
  linkText: {
    color: theme.palette.neutral.darker,
    '& span': {
      fontSize: theme.typography.body1.fontSize,
    },
    marginTop: 0,
    marginBottom: 0,
  },
  linkBadge: {
    fontSize: '11px !important',
    fontWeight: theme.typography.fontWeightBold,
    height: '20px !important',
    position: 'absolute',
    right: 12,
    backgroundColor: `${theme.palette.primary.main} !important`,

    '& span.MuiChip-label, & span.MuiChip-label:hover': {
      cursor: 'pointer',
      color: theme.palette.background.default,
      paddingleft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  categoryBadge: {
    top: 12,
  },
  divider: {
    height: '1px',
    margin: theme.spacing(4),
    backgroundColor: theme.palette.neutral.light,
  },
  sidebarSection: {
    color: theme.palette.neutral.darker,
    padding: theme.spacing(0, 4),
    opacity: 0.9,
    display: 'block',
    fontWeight: `${theme.typography.fontWeightBold} !important`,
  },
  button: {
    padding: '4px 10px 0px',
  },
  iconButton: {
    '& svg': {
      width: 30,
      height: 30,
      color: theme.palette.neutral.darker,
      opacity: 0.5
    },
  },
  tooltip: {
    padding: theme.spacing(1, 2),
    fontSize: '1.2em',
  },
})
