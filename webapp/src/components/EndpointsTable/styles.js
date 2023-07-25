export default (theme) => ({
  healthContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '250px',
    wordBreak: 'break-all',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '300px',
      wordBreak: 'normal',
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: '350px',
    }
  },
  titleCell: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    '& .MuiButton-root': {
      alignSelf: 'center',
      marginLeft: theme.spacing(2),
    }
  },
})
