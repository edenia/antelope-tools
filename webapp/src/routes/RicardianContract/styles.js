export default (theme) => ({
  root: {
    '& svg': {
      fontSize: '35px !important',
    },
    '& h4': {
      fontSize: '15px !important',
      fontWeight: '600',
    },
    '& h6': {
      color: theme.palette.neutral.dark
    },
    '& a': {
      lineBreak: 'anywhere',
    },
    [theme.breakpoints.up('sm')]: {
      '& svg': {
        fontSize: '45px !important',
      },
      '& h4': {
        fontSize: '34px !important',
        fontWeight: 'normal',
      },
    },
  },
})
