export default (theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing(2),
    '& img': {
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      aspectRatio: '1 / 1',
    },
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '200px',
  },

  socialContainer: {
    display: 'flex',
    gap: theme.spacing(4),
    '& svg': {
      width: '32px',
      height: '32px',
      cursor: 'pointer',
    },
  },
})
