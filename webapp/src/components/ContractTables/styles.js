export default (theme) => ({
  form: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  formControl: {
    display: 'block',
    width: '12%',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      width: '10%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      minWidth: '180px',
    }
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
    [theme.breakpoints.down('lg')]: {
      width: '100px !important',
    },
    [theme.breakpoints.down('md')]: {
      width: '100% !important',
    },
    width: '120px !important',
    display: 'inline-block',
  },
  fieldsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '80%',
    gap: '8px',
  },
  textField: {
    width: '200px',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  checkBox: {
    '& .MuiCheckbox-root': {
      padding: `${theme.spacing(1)} !important`,
    }
  }
})
