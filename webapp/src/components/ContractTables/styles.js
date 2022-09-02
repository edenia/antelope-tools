export default (theme) => ({
  form: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  formControl: {
    display: 'block',
    width: '100%',
    minWidth: '180px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      width: 'initial',
      marginRight: theme.spacing(2)
    }
  },
  tableCell: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  tableEmpty:{
    width: '150px !important',
    display:'inline-block',
  }
  })
