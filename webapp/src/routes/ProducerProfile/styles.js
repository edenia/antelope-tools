export default (theme) => ({
  container: {
    margin: theme.spacing(4, 0),
  },
  profileContainer: {
    padding: '0 !important',
  },
  dataContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
    marginTop: theme.spacing(5),
    '& > div': {
      gap: theme.spacing(4),
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(6),
    backgroundImage: 'url(https://antelope.tools/images/profile-bg-image.webp)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply',
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  socialLinks: {
    display: 'flex',
    gap: theme.spacing(5),
    alignSelf: 'end',
    padding: theme.spacing(0, 0, 2),
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      justifyContent: 'center',
      alignSelf: 'center',
    },
    '& svg': {
      color: theme.palette.neutral.dark,
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
    boxShadow: theme.palette.shadows.profileCard,
    backgroundColor: theme.palette.background.light,
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
})
