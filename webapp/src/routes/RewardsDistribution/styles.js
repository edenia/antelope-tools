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
    marginBottom: 24,
    padding: '2px',
  },
  linearLoader: {
    width: 'calc(100% - 32px)',
    marginTop: -16,
    marginLeft: 16,
  },
  itemLabel: {
    minWidth: '120',
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
    marginBottom: '10px',
    gap: '10px',
    flexWrap: 'nowrap',
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
    minHeight: '116px',
    '& .MuiTypography-h6': {
      display: 'flex',
    },
  },
  shadow: {
    '& .MuiPaper-root': {
      boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      padding: theme.spacing(1),
    },
  },
  nonCompliant: {
    display: 'flex',
    alignItems: 'center',
  },
  nonCompliantButton: {
    height: theme.spacing(6),
  },
})
