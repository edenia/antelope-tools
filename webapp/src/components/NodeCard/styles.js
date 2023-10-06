export default (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    paddingBottom: `${theme.spacing(1)} !important`,
    '& span': {
      textTransform: 'unset !important',
    },
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '100%',
    backgroundColor: theme.palette.primary.contrastText,
  },
  dl: {
    marginTop: -16,
    marginBottom: -16,
  },
  bold: {
    fontWeight: 'bold',
  },
  breakLine: {
    wordBreak: 'break-word',
  },
  nodes: {
    width: '260px',
    padding: theme.spacing(0, 3, 0),
    overflowX: 'auto',
    '& .MuiCardContent-root:last-child': {
      paddingBottom: theme.spacing(4),
    },
    boxShadow: '2px 3px 4px 0px #0000002E',
    backgroundColor: '#f6f9fd',
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
    padding: theme.spacing(0, 2, 0),
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
