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
  expandMore: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    '& .MuiButtonBase-root': {
      textTransform: 'capitalize',
    },
  },
  cardActions: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  collapse: {
    width: '100%',
    marginRight: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      width: '55%',
    },
  },
  emptyStateRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
      marginLeft: theme.spacing(5),
      marginTop: theme.spacing(1),
    },
  },
  socialLinksContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(4),
    '& svg': {
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.3)',
      },
    },
  },
  tableRow: {
    '& .MuiTableCell-root': {
      padding: `${theme.spacing(1, 2)} !important`,
    },
    '& .MuiTypography-h2': {
      fontSize: '1.5rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '1.2rem',
      },
    },
    '&:hover': {
      backgroundColor: '#f0f3fa',
    },
  },
  tableHead: {
    borderBottom: `2px solid ${theme.palette.primary.main} !important`,
    '& .MuiTableCell-root': {
      padding: `${theme.spacing(0, 2, 2)} !important`,
    },
  },
  hideOnMobile: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  website: {
    [theme.breakpoints.down('xl')]: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis', 
      width: '140px',
    },
  },
  country: {
    [theme.breakpoints.down('md')]: {
      textAlign: 'center'
    },
  }
})
