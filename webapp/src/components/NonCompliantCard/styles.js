export default (theme) => ({
  flex: {
    display: 'flex',
    flexWrap: 'wrap',
    '& .MuiTypography-body1': {
      margin: theme.spacing(1),
    },
  },
  title: {
    fontWeight: 'bold !important',
    fontSize: '12px !important',
    textTransform: 'uppercase',
  },
  bold: {
    fontWeight: '600 !important',
  },
  text: {
    width: '60px',
  },
  account: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    [theme.breakpoints.down('sm')]: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      paddingBottom: theme.spacing(4),
    },
  },
  content: {
    width: '250px',
    height: 'auto',
    margin: '0px',
    flexGrow: '1',
    [theme.breakpoints.down('lg')]: {
      width: '150px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  borderLine: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
      padding: theme.spacing(0, 3, 0),
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(3),
    },
  },
  lightIcon: {
    '& svg': {
      marginLeft: theme.spacing(2),
    },
  },
})
