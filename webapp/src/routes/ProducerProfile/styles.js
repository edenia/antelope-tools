export default (theme) => ({
  dataContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
    marginTop: theme.spacing(5),
    '& > div': {
      padding: 0,
      gap: theme.spacing(4),
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
  },
  healthContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(4),
  },
  healthIndicator: {
    display: 'flex',
    flexDirection: 'column',
    width: 'calc( 100% / 3 )',
    textAlign: 'center',
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
