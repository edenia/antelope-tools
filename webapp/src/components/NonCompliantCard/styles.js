export default (theme) => ({
  websiteContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    '& div > svg':{
      marginTop: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]:{
      gap: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]:{
      gap: theme.spacing(8),
    },
  },
})
