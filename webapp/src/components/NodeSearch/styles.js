export default (theme, eosConfig) => ({
  formControl: {
    width: '100%'
  },
  colorWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  colorItem: {
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  [eosConfig.nodeTypes[0].name]: {
    backgroundColor: eosConfig.nodeTypes[0].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  [eosConfig.nodeTypes[1].name]: {
    backgroundColor: eosConfig.nodeTypes[1].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  [eosConfig.nodeTypes[2].name]: {
    backgroundColor: eosConfig.nodeTypes[2].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  [eosConfig.nodeTypes[3].name]: {
    backgroundColor: eosConfig.nodeTypes[3].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  logo: {
    marginRight: theme.spacing(1),
    display: 'inline-block',
    borderRadius: '500rem'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  centerVertically: {
    display: 'flex',
    alignItems: 'center'
  },
  bold: {
    fontWeight: 'bold',
    paddingRight: 4
  },
  cardContent: {
    padding: `${theme.spacing(4)}px !important`
  },
  nodeSearchWrapper: {
    marginBottom: theme.spacing(2)
  },
  chipWrapper: {
    marginTop: theme.spacing(2),
    '& .MuiChip-root': {
      marginRight: theme.spacing(2)
    },
    textTransform: 'capitalize'
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: '#fff'
  }
})
