export default (theme) => ({
  ricardianContractContainer: {
    '& h3': {
      fontSize: 38,
    },
    [theme.breakpoints.up('sm')]: {
      '& h3': {
        fontSize: 50,
      },
    },
  },
  boxTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
  },
  boxText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    '& h6': {
      fontStyle: 'italic',
      lineHeight: 1,
      color: theme.palette.neutral.dark
    },
    '& h5': {
      lineHeight: 1,
    },
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  hash: {
    '& span': {
      fontWeight: 'bold',
    },
    wordBreak: 'break-all',
  },
})
