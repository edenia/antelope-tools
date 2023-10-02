export default (theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    paddingBottom: 0,
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    '& .MuiCardHeader-title': {
      textTransform: 'lowercase',
    },
    '& .MuiCardHeader-root': {
      padding: theme.spacing(2, 4, 0),
    },
    [theme.breakpoints.up('sm')]: {
      width: 300,
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      paddingBottom: theme.spacing(4),
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0, 4, 0),
    '& .MuiTypography-overline': {
      marginLeft: 0,
      fontWeight: '700',
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 980,
      overflowY: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      '& .MuiTypography-overline': {
        marginLeft: theme.spacing(3),
        lineHeight: '0',
      },
    },
  },
  nodesContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  hideScroll: {
    overflowX: 'hidden',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  expandMore: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    '& .MuiButtonBase-root': {
      textTransform: 'capitalize',
    },
  },
  node: {
    [theme.breakpoints.up('lg')]: {
      width: 260,
      marginBottom: 0,
    },
  },
  textWrap: {
    width: 210,
    wordWrap: 'break-word',
    display: 'block !important',
    overflow: 'visible !important',
    whiteSpace: 'normal !important',
    [theme.breakpoints.up('lg')]: {
      width: 290,
    },
  },
  cardActions: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  breakLine: {
    wordBreak: 'break-word',
  },
  boxLabel: {
    alignItems: 'baseline !important',
  },
  flexColumn: {
    flexDirection: 'column !important',
  },
  collapse: {
    width: '50%',
  },
  infoIcon: {
    cursor: 'pointer',
    flexDirection: 'flex-end',
  },
  dt: {
    maxWidth: 100,
  },
  shadow: {
    '& .MuiPaper-root': {
      boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      padding: theme.spacing(3),
      maxWidth: '250px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      borderRadius: '5px',
    },
  },
  infoItems: {
    display: 'flex',
    flexDirection: 'column',
    '& .listBox': {
      marginLeft: theme.spacing(1),
    },
    '& .listLabel': {
      height: '100%',
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
        fontSize: 15,
      },
      '& .MuiTypography-body1': {
        whiteSpace: 'nowrap',
      },
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 150,
    },
  },
  clickableIcon: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  popoverStyle: {
    paddingRight: theme.spacing(2),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  emptyStateRow: {
    display: 'flex',
    alignItems: 'center',
    '& span': {
      width: '16em',
      height: '45px',
      fontSize: '1.2em',
      fontWeight: 'bold',
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: '1.12',
      letterSpacing: '-0.22px',
      textAlign: 'center',
      color: '#3d3d3dde',
    },
  },
  socialLinksContainer: {
    display: 'flex',
    gap: theme.spacing(4),
    '& svg': {
      width: '32px',
      height: '32px',
      cursor: 'pointer',
    },
  },
})
