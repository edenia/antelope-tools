export default (theme) => ({
  card: {
    margin: theme.spacing(4, 0),
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15) !important',
  },
  dataContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
    marginTop: theme.spacing(5),
    '& > div': {
      padding: 0,
      gap: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      }
    },
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(6),
    '& > div + div': {
      padding: theme.spacing(0, 6),
    },
  },
  socialLinks: {
    display: 'flex',
    gap: theme.spacing(5),
    alignSelf: 'end',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    '& svg':{
      color: '#000000DE',
      '&:hover': {
        color: theme.palette.primary.main,
        transform: 'scale(1.3)',
      }
    }
  },
  healthContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  healthIndicator: {
    display: 'flex',
    flexDirection: 'column',
    width: 'calc( 100% / 3 )',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 'calc( 100% / 2 )',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& > p': {
      margin: 0,
    },
    '& > svg': {
      width: '30px',
      height: '30px',
    },
  },
  OrgDataContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(4),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    boxShadow: '0px -2px 8px 0px #0000004D',
    backgroundColor: '#F6F9FD',
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(8),
    }
  },
  OrgDataItem: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexGrow: '1',
    '& > p': {
      '& span': {
        textTransform: 'uppercase',
      },
      '& > a': {
        margin: 0,
      },
    },
  },
  eosRateContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    '& .MuiTypography-root': {
      display: 'flex',
    },
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
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
    '& a': {
      color: theme.palette.primary.main,
      textDecorationColor: theme.palette.primary.main,
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
