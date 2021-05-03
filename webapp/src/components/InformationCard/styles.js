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
    padding: theme.spacing(4),
    '& .bodyWrapper': {
      display: 'flex',
      flexDirection: 'column'
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      '& .bodyWrapper': {
        flexDirection: 'row'
      }
    }
  },
  media: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
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
      padding: theme.spacing(0, 6)
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
    borderLeft: 'none',
    marginBottom: theme.spacing(3),
    '& .MuiTypography-body1': {
      margin: theme.spacing(1, 0),
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: 350
    },
    [theme.breakpoints.up('lg')]: {
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',

      padding: theme.spacing(0, 2),
      marginBottom: 0
    }
  },
  twoBoxes: {
    marginBottom: theme.spacing(3),
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
    '& .nodes': {
      borderLeft: 'none',
      width: 100,
      '& .MuiSvgIcon-root': {
        marginLeft: theme.spacing(1),
        fontSize: 20
      }
    },
    '& .healthStatus': {
      '& .MuiSvgIcon-root': {
        marginLeft: theme.spacing(1),
        fontSize: 20
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
      padding: theme.spacing(0, 2),
      marginBottom: 0,
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',

      '& .nodes, .social': {
        borderLeft: '1px solid rgba(0, 0, 0, 0.2)',

        paddingLeft: theme.spacing(1),
        marginRight: theme.spacing(2)
      }
    }
  },
  cardActions: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  }
})
