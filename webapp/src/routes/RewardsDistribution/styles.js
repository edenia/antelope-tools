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
    marginTop: theme.spacing(3),
    boxShadow: '0px 0px 14px rgba(53, 64, 82, 0.35) !important'
  },
  flexdad: {
    flexDirection: 'row',
    display: 'flex',
  },
  rewardsdiv: {
    flexGrow: 1,
    marginLeft: 10,
  },
  mainReward: {
    flexGrow: 1,
  },
  boxPadding:{
    padding: '10px'
  },
  boxShadow:{
    boxShadow: '10px 5px 5px red !important',
  },
})
