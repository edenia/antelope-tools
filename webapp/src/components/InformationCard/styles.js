export default (theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    paddingBottom: 0,
    [theme.breakpoints.up('sm')]: {
      width: 300
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      paddingBottom: theme.spacing(2)
    }
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(4),
    '& .MuiTypography-overline': {
      marginLeft: 0
    },
    '& .bodyWrapper': {
      display: 'flex',
      flexDirection: 'column'
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 980,
      overflowY: 'scroll',
      flexDirection: 'row',
      '& .bodyWrapper': {
        flexDirection: 'row'
      },
      '& .MuiTypography-overline': {
        marginLeft: theme.spacing(3),
        lineHeight: '0'
      }
    }
  },
  media: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    '& img': {
      width: 82,
      height: 82,
      borderRadius: 40
    },
    '& .bpName': {
      fontSize: 28,
      lineHeight: '34px',
      letterSpacing: '-0.233333px',
      marginBottom: theme.spacing(1),
      textAlign: 'center'
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 6),
      width: 300
    }
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  expandMore: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    '& .MuiButtonBase-root': {
      textTransform: 'capitalize'
    }
  },
  info: {
    borderLeft: 'none'
  },
  entity: {
    [theme.breakpoints.up('lg')]: {
      width: 350,
      marginBottom: 0
    }
  },
  node: {
    [theme.breakpoints.up('lg')]: {
      width: 400,
      marginBottom: 0
    }
  },
  textEllipsis: {
    margin: theme.spacing(1, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 350
  },
  textWrap: {
    width: 210,
    wordWrap: 'break-word',
    [theme.breakpoints.up('lg')]: {
      width: 290
    }
  },
  twoBoxes: {
    borderLeft: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiTypography-body1': {
      margin: theme.spacing(1, 0),
      display: 'flex',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    '& .healthStatus': {
      '& .MuiSvgIcon-root': {
        marginLeft: theme.spacing(1),
        fontSize: 15
      }
    },
    '& .social': {
      borderLeft: 'none',
      width: 100,
      '& a': {
        display: 'flex'
      },
      '& svg': {
        marginRight: theme.spacing(1)
      }
    },
    '& .success': {
      color: theme.palette.success.main
    },
    '& .error': {
      color: theme.palette.error.main
    },
    '& .warning': {
      color: theme.palette.warning.main
    },
    [theme.breakpoints.up('lg')]: {
      marginBottom: 0,
      '& .healthStatus, .social': {
        width: 150
      }
    }
  },
  cardActions: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  },
  breakLine: {
    wordBreak: 'break-word'
  },
  borderLine: {
    borderLeft: 'none',
    height: 'calc(100% - 25px)',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('lg')]: {
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
      padding: theme.spacing(0, 3)
    }
  },
  nodes: {
    borderLeft: 'none',
    '& .MuiTypography-body1': {
      margin: theme.spacing(1, 0),
      display: 'flex',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    '& .MuiSvgIcon-root': {
      marginLeft: theme.spacing(1),
      fontSize: 15
    },
    [theme.breakpoints.up('lg')]: {
      width: 150
    }
  },
  rowWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& .listBox': {
      marginLeft: theme.spacing(1)
    },
    '& .listLabel': {
      height: '100%',
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
        fontSize: 15
      },
      '& .MuiTypography-body1': {
        whiteSpace: 'nowrap'
      }
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 150
    }
  },
  boxLabel: {
    alignItems: 'baseline !important'
  },
  flexColumn: {
    flexDirection: 'column !important'
  }
})
