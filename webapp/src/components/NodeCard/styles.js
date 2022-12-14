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
    padding: theme.spacing(3),
    overflowX: 'auto',
    marginLeft: '5px',
    marginRight: '5px',
    borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
  },
  nodesWrapper: {
    display: 'flex',
    width: 'max-content',
    flexFlow: 'row nowrap',
    padding: theme.spacing(2),
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
  buttonApis: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
  }
})
