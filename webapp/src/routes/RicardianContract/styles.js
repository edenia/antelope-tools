export default (theme) => ({
  root: {
    padding: theme.spacing(2),
    '& svg': {
      fontSize: '35px !important',
    },
    '& h4': {
      fontSize: '15px !important',
      fontWeight: '600',
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
  cardShadow: {
    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
  },
})
