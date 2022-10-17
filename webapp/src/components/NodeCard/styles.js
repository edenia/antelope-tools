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
    '& span':{
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
    minWidth: '150px',
    padding: theme.spacing(3),
    overflowX: 'auto',
    marginLeft: '5px',
    marginRight: '5px',
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
  nodesContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    padding: theme.spacing(2),
  },
  nodesWrapper: {
    display: 'flex',
    width: 'max-content',
  },
  endpointsTitle: {
    display: 'flex',
  },
  lightIcon: {
    display: 'flex',
    fontWeight: 'normal',
    marginLeft: theme.spacing(3),
    '& svg': {
      width: '15px',
      height: '15px',
      alignSelf: 'center',
      marginLeft: theme.spacing(2),
    },
  },
})
