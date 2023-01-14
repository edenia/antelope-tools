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
    width: '280px',
    padding: theme.spacing(0, 3, 0),
    overflowX: 'auto',
    borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
    '& .MuiCardContent-root:last-child': {
      paddingBottom: theme.spacing(4),
    },
  },
  nodesWrapper: {
    display: 'flex',
    width: 'max-content',
    flexFlow: 'row nowrap',
    padding: theme.spacing(0, 2, 0),
    [theme.breakpoints.up('lg')]: {
      paddingRight: '250px',
    },
  },
  endpointsTitle: {
    display: 'flex',
  },
  lightIcon: {
    display: 'flex',
    fontWeight: 'normal',
    marginLeft: theme.spacing(3),
    '& svg': {
      marginLeft: theme.spacing(2),
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
