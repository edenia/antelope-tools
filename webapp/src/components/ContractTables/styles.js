export default (theme) => ({
  form: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  formControl: {
    display: 'block',
    width: '100%',
    minWidth: '180px',
    [theme.breakpoints.up('md')]: {
      width: '15%',
      marginRight: theme.spacing(2),
    },
  },
  refreshButton: {
    [theme.breakpoints.up('md')]: {
      marginLeft: `${theme.spacing(4)} !important`,
    },
  },
  tableCell: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  loadMore: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  tableEmpty: {
    [theme.breakpoints.up('md')]: {
      width: '150px !important',
    },
    display: 'inline-block',
  },
})
