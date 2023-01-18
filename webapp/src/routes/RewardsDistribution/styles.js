export default (theme, lowestRewardsColor, highestRewardsColor) => ({
  spaceBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
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
    backgroundColor: lowestRewardsColor,
  },
  highestRewards: {
    backgroundColor: highestRewardsColor,
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
  },
  mapWrapper: {
    marginTop: theme.spacing(3),
  },
  boxPadding: {
    padding: '10px',
  },
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
  divMargin: {
    display: 'flex',
    margin: theme.spacing(8, 0),
    gap: theme.spacing(6),
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  cardHeader: {
    flexGrow: '1',
    [theme.breakpoints.down('md')]: {
      marginBottom: '10px',
    },
  },
  cards: {
    height: '156px',
    '& .MuiTypography-h6': {
      display: 'flex',
      paddingBottom: theme.spacing(4),
    },
  },
  shadow: {
    '& .MuiPaper-root': {
      boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      padding: theme.spacing(1),
    },
  },
  nonCompliantButton: {
    height: '30px',
    borderRadius: '90px !important',
    backgroundColor: '#1565c0 !important',
  },
  expandIcon: {
    cursor: 'pointer',
    width: '24px',
    height: '24px',
  },
  textMargin: {
    margin: `${theme.spacing(4, 0)} !important`,
    wordBreak: 'break-word'
  },
})
