export default (theme) => ({
  healthContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '250px',
  },
  titleCell: {
    display: 'flex',
    '& svg': {
      alignSelf: 'center',
      marginLeft: theme.spacing(2),
      cursor: 'pointer',
    },
  },
})
