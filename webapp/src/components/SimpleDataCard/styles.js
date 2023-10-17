export default (theme) => ({
  cards: {
    textTransform: 'capitalize',
    minHeight: '90px',
    height: '100%',
  },
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    backgroundColor: `${theme.palette.background.default} !important`,
  },
  border: {
    border: '0.5px solid transparent',
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
  textValue: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%',
    alignItems: 'center',
  },
  svgLink: {
    fontSize: 18,
    marginLeft: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
    '&:hover': {
      '& svg': {
        cursor: 'pointer',
        color: theme.palette.primary.main,
      }
    }
  },
  title: {
    fontWeight: 'bold !important',
  },
  tooltipHover: {
    '&:hover': {
      border: `0.5px solid ${theme.palette.primary.main}`,
      boxShadow: '0px 0px 40px -30px #1565c0bf inset !important',
      '& svg': {
        cursor: 'pointer',
        color: theme.palette.primary.main,
      }
    },
  },
  tooltip: {
    width: '18px !important',
    height: '18px !important',
    color: theme.palette.neutral.darker,
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
