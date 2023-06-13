export default (theme) => ({
  healthContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '250px',
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
