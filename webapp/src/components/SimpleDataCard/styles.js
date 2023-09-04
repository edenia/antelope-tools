export default (theme) => ({
  cards: {
    textTransform: 'capitalize',
    minHeight: '90px',
    '& .MuiTypography-h6': {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: theme.spacing(2),
    },
  },
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
  cardHeader: {
    flexGrow: '1',
    flexBasis: 'calc(100%/5)',
    [theme.breakpoints.down('md')]: {
      marginBottom: '10px',
    },
    '& .MuiPaper-root': {
      height: '100%',
    },
  },
  cardGrow: {
    flexGrow: '1',
    flexBasis: 'calc(100%/5)',
    [theme.breakpoints.down('md')]: {
      flexBasis: 'calc(100%/3)',
      marginBottom: '10px',
    },
    '& .MuiPaper-root': {
      height: '100%',
    },
  },
  lowercase: {
    textTransform: 'lowercase !important',
  },
  svgLink: {
    fontSize: 18,
    marginLeft: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  tooltip: {
    width: '20px !important',
    height: '20px !important',
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.primary.main,
    },
  },
  tooltipPopper: {
    padding: theme.spacing(1),
    maxWidth: '150px',
    textAlign: 'center',
    '& .MuiTooltip-tooltip': {
      paddingBottom: `${theme.spacing(2)} !important`,
      fontSize: '1.1em !important',
      fontWeight: 'normal !important',
      lineHeight: '18px !important',
      overflowWrap: 'break-word !important',
    },
  },
})
