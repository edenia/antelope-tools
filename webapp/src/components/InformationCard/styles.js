export default (theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    paddingBottom: 0,
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    '& .MuiCardHeader-title': {
      textTransform: 'lowercase',
    },
    [theme.breakpoints.up('sm')]: {
      width: 300,
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      paddingBottom: theme.spacing(2),
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0, 4, 4, 4),
    '& .MuiTypography-overline': {
      marginLeft: 0,
      fontWeight: '700',
    },
    '& .bodyWrapper': {
      display: 'flex',
      flexDirection: 'column',
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 980,
      overflowY: 'hidden',
      flexDirection: 'row',
      '& .bodyWrapper': {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
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
  media: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    '& img': {
      width: 82,
      height: 82,
    },
    '& .bpName': {
      fontSize: 28,
      lineHeight: '34px',
      letterSpacing: '-0.233333px',
      marginBottom: theme.spacing(1),
      textAlign: 'center',
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 6),
      width: 250,
      minWidth: 250,
      justifyContent: 'center',
    },
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
  info: {
    borderLeft: 'none',
    '& .MuiTypography-body1': {
      margin: theme.spacing(1),
      display: 'flex',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  entity: {
    [theme.breakpoints.up('lg')]: {
      width: 260,
      marginBottom: 0,
    },
  },
  node: {
    [theme.breakpoints.up('lg')]: {
      width: 260,
      marginBottom: 0,
    },
  },
  textEllipsis: {
    margin: theme.spacing(1, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 350,
    '& a': {
      marginLeft: theme.spacing(1),
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
  borderLine: {
    marginTop: theme.spacing(2),
    borderLeft: 'none',
    height: 'calc(100% - 25px)',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('lg')]: {
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
      padding: theme.spacing(0, 3),
    },
  },
  nodes: {
    borderLeft: 'none',
    '& .MuiTypography-body1': {
      margin: theme.spacing(1, 0),
      display: 'flex',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    '& .MuiSvgIcon-root': {
      marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.up('lg')]: {
      width: 140,
    },
  },
  rowWrapper: {
    display: 'flex',
    alignItems: 'center',
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
  boxLabel: {
    alignItems: 'baseline !important',
  },
  flexColumn: {
    flexDirection: 'column !important',
  },
  collapse: {
    width: '100%',
  },
  healthStatus: {
    '& .MuiTypography-body1': {
      margin: theme.spacing(1, 0),
      display: 'flex',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    '& .MuiSvgIcon-root': {
      marginLeft: theme.spacing(1),
      height: '22px',
      widht: '22px',
    },
    '& .success': {
      color: theme.palette.success.main,
    },
    '& .error': {
      color: theme.palette.error.main,
    },
    '& .warning': {
      color: theme.palette.warning.main,
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 130,
    },
  },
  social: {
    borderLeft: 'none',
    width: 100,
    '& .MuiTypography-body1': {
      margin: theme.spacing(1, 0),
      display: 'flex',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    '& a': {
      display: 'flex',
    },
    '& svg': {
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 120,
    },
  },
  dd: {
    marginLeft: theme.spacing(1),
    margin: theme.spacing(1, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
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
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clickableIcon: {
    cursor: 'pointer',
    '&:hover': {
      color: '#1565c0',
    },
  },
  popoverStyle: {
    paddingRight: theme.spacing(2),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  textEllipsisNodes: {
    margin: theme.spacing(1, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
    '& a': {
      marginLeft: theme.spacing(1),
    },
  },
  centerWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
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
  horizontalLine: {
    [theme.breakpoints.down('lg')]: {
      width: '270px',
      height: '1px',
      margin: '15.2px 32px 40px 33px',
      backgroundColor: '#e0e0e0',
    },
  },
  imgError: {
    [theme.breakpoints.down('lg')]: {
      width: '200px',
      height: '120px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '260px',
      height: '160px',
    },
    objectFit: 'contain',
  },
})
