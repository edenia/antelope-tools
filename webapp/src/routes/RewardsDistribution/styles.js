export default (theme, lowestRewardsColor, highestRewardsColor) => ({
  action: {
    cursor: 'pointer'
  },
  popoverItem: {
    fontWeight: 'bold',
    trigger : 'hover'

  },
  countryFlag: {
    marginRight: theme.spacing(1)
  },
  countryFlagUnknown: {
    marginRight: theme.spacing(0.5)
  },
  producersList: {
    margin: 0
  },
  geography: {
    outline: 'none',
    cursor: 'pointer'
  },
  lowestRewards: {
    backgroundColor: lowestRewardsColor,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'inline-block'
  },
  highestRewards: {
    backgroundColor: highestRewardsColor,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'inline-block'
  },
  rewardsColorSchema: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4
  },
  linearLoader: {
    width: 'calc(100% - 32px)',
    marginTop: -16,
    marginLeft: 16
  },
  itemLabel: {
    minWidth: 120
  },
  mapWrapper: {
    marginTop: theme.spacing(3)
  }
})
