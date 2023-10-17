export default (theme) => ({
  content: {
    flex: 1,
  },
  cardHeader: {
    paddingBottom: `${theme.spacing(1)} !important`,
    '& span': {
      textTransform: 'unset !important',
    },
  },
  bold: {
    fontWeight: 'bold',
  },
  nodes: {
    width: '260px',
    padding: theme.spacing(0, 3, 0),
    overflowX: 'auto',
    '& .MuiCardContent-root:last-child': {
      paddingBottom: theme.spacing(4),
    },
    boxShadow: '2px 3px 4px 0px #0000002E',
    backgroundColor: theme.palette.background.light,
    borderRadius: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      width: '230px',
    },
  },
  nodesWrapper: {
    display: 'flex',
    width: 'max-content',
    flexFlow: 'row wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(0, 2, 2),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      width: 'auto',
      padding: 0,
      marginBottom: theme.spacing(8),
    },
  },
  endpointsTitle: {
    display: 'flex',
  },
  lightIcon: {
    display: 'flex',
    fontWeight: 'normal',
    marginLeft: theme.spacing(3),
    '& span': {
      marginRight: theme.spacing(2),
    },
  },
  keysContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '130px',
    height: '32px',
  },
  keys: {
    wordBreak: 'break-word',
  },
  buttonApis: {
    paddingTop: theme.spacing(2),
  },
  version: {
    display: 'flex',
  },
  chip: {
    marginLeft: theme.spacing(5),
  },
})
