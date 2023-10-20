export default (theme) => ({
  paper: {
    width: '100%',
    height: 'auto',
    '&:focus': {
      outline: 'none',
    },
    marginTop: theme.spacing(2),
  },
  accordion: {
    boxShadow: 'none !important',
    width: '100%',
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
    '& .MuiPaper-root': {
      boxShadow: 'none !important',
    },
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
      borderLeft: `1px solid ${theme.palette.neutral.light}`,
    },
  },
  iconBorder: {
    backgroundColor: theme.palette.neutral.lighter,
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
