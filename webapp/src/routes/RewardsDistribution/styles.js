export default (theme) => ({
  spaceBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  verticallyCenter: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textBlock: {
    marginTop: `${theme.spacing(4)} !important`,
  },
  popoverItem: {
    fontWeight: 'bold',
  },
  countryFlag: {
    marginLeft: theme.spacing(1),
  },
  countryFlagUnknown: {
    marginLeft: theme.spacing(0.5),
  },
  producersList: {
    margin: 0,
  },
  geography: {
    outline: 'none',
    cursor: 'pointer',
  },
  squareRewards: {
    width: '38px',
    height: '38px',
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    display: 'inline-block',
  },
  lowestRewards: {
    backgroundColor: theme.palette.primary.light,
  },
  highestRewards: {
    backgroundColor: theme.palette.primary.dark,
  },
  rewardsColorSchema: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
    padding: '2px',
  },
  linearLoader: {
    width: 'calc(100% - 32px)',
    marginTop: -16,
    marginLeft: 16,
  },
  itemLabel: {
    width: '50%',
    textAlign: 'center',
    lineHeight: '1',
  },
  exchangeRateLabel: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  mapWrapper: {
    marginTop: theme.spacing(3),
  },
  boxPadding: {
    padding: '10px',
  },
  divMargin: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    margin: theme.spacing(8, 0),
    gap: theme.spacing(6),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  cardHeader: {
    width: '100%',
  },
  cardContent: {
    height: '100%',
    '& .MuiCardContent-root:last-child': {
      paddingBottom: theme.spacing(4),
    },
  },
  cards: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& h2': {
      fontWeight: 'bold'
    },
  },
  exchangeCard: {
    justifyContent: 'space-around',
  },
  totalDailyCard: {
    justifyContent: 'flex-start',
    '& .MuiTypography-h6': {
      paddingBottom: theme.spacing(2),
    },
  },
  nonCompliantButton: {
    height: '30px',
    fontSize: '12px !important',
    textAlign: 'center',
  },
  expandIcon: {
    cursor: 'pointer',
    width: '24px',
    height: '24px',
  },
  textMargin: {
    lineHeight: '1 !important',
    fontWeight: 'normal !important',
    wordBreak: 'break-word',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xl')]: {
      fontSize: '14px !important',
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: '16px !important',
    },
  },
  marginPaidText: {
    padding: theme.spacing(2, 0),
  },
  notLocated: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& h2': {
      width: 'calc(100% - 125px)',
      paddingBottom: theme.spacing(2),
    },
  },
})
