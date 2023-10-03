export default (theme) => ({
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
      marginBottom: theme.spacing(4),
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignSelf: 'center',
    },
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
  },
  OrgDataItem: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexGrow: '1',
    '& > p > span': {
      textTransform: 'uppercase',
    },
  },
})
