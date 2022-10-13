export default (theme, lowestRewardsColor, highestRewardsColor) => ({
  action: {
    cursor: 'pointer',
  },
  popoverItem: {
    fontWeight: 'bold',
  },
  countryFlag: {
    marginRight: theme.spacing(1),
  },
  countryFlagUnknown: {
    marginRight: theme.spacing(0.5),
  },
  producersList: {
    margin: 0,
  },
  geography: {
    outline: 'none',
    cursor: 'pointer',
  },
  lowestRewards: {
    backgroundColor: lowestRewardsColor,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'inline-block',
  },
  highestRewards: {
    backgroundColor: highestRewardsColor,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'inline-block',
  },
  rewardsColorSchema: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
  },
  linearLoader: {
    width: 'calc(100% - 32px)',
    marginTop: -16,
    marginLeft: 16,
  },
  itemLabel: {
    minWidth: 120,
  },
  mapWrapper: {
    marginTop: theme.spacing(3)
    },
  topCard: {
    flexDirection: 'row',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      paddingTop: '5px'
    }
  },
  rewardsdiv: {
    flexGrow: 1,
    marginLeft: 10,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      padding: '5px',
      margin: '5px'
    }
  },
  mainCard: {
    flexGrow: 1,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      padding: '5px',
      margin: '5px'
    }
  },
  root: {
    '& .MuiPaper-root': {
      boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    },
  },
  boxPadding: {
    padding: '10px',
  },
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
})
