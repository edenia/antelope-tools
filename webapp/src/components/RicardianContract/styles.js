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
    '& img': {
      width: 25,
    },
  },
  boxText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    '& h6': {
      fontStyle: 'italic',
      lineHeight: 1,
    },
    '& h5': {
      lineHeight: 1,
    },
  },
  defaultIcon: {
    fontSize: 65,
    color: '#484158',
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
