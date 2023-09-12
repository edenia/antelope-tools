export default (theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    borderRadius: 10,
    padding: theme.spacing(4),
    width: '100%',
    direction: 'column',
    justify: 'space-between',
    height: 'auto',
    '&:focus': {
      outline: 'none',
    },
    marginTop: theme.spacing(2),
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  accordion: {
    boxShadow: 'none',
    width: '100%',
    borderRadius: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  accordionSummary: {
    padding: 0,
  },
  keyItem: {
    display: 'flex',
    textTransform: 'capitalize',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100px',
    paddingTop: theme.spacing(2),
    '& p': {
      marginRight: theme.spacing(2),
    },
    '& p:first-child': {
      minWidth: '80px',
    },
  },
  keyIcon: {
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.54)',
  },
  keyLabel: {
    wordBreak: 'break-all',
  },
  resourceWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  boxHeaderCard: {
    display: 'flex',
    flexDirection: 'column',
    '& .identicon': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .resourceUsage': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .recharts-wrapper': {
        marginBottom: theme.spacing(2),
      },
    },
    [theme.breakpoints.up('sm')]: {
      '& .resourceUsage': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& .columTitle': {
        marginLeft: theme.spacing(2),
      },
      '& .resourceUsage': {
        justifyContent: 'center',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: '100%',
      },
      '& .keys': {
        paddingLeft: theme.spacing(2),
        height: '100%',
      },
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      paddingBottom: theme.spacing(4),
      '& .identicon': {
        alignItems: 'center',
        width: 200,
      },
    },
  },
  border: {
    [theme.breakpoints.up('lg')]: {
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
    },
  },
  iconBorder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    width: 85,
    height: 85,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPadding: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(4),
    },
  },
})
