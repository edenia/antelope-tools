export default (theme) => ({
  boxInfo: {
    '& p': {
      fontSize: 14,
      lineHeight: '21px',
      letterSpacing: '0.07875px',
    },
    '& h4': {
      fontWeight: '600',
      fontSize: 20,
      lineHeight: '24px',
      textAlign: 'justify',
      marginBottom: theme.spacing(4),
    },
  },
  imageContainer: {
    '& > img': {
      float: 'right',
      aspectRatio: '683 / 389',
      [theme.breakpoints.down('xl')]: {
        width: '550px',
      },
      [theme.breakpoints.down('lg')]: {
        width: '500px',
      },
      [theme.breakpoints.down('md')]: {
        width: '50%',
      },
      [theme.breakpoints.down('sm')]: {
        width: '80%',
      },
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(4, 0, 4, 0),
    },
  },
  mainText: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
})
