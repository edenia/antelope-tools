export default (theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing(2),
    '& img': {
      borderRadius: '50%',
      aspectRatio: '1 / 1',
    },
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
  smallAvatar: {
    width: '56px',
    height: '56px',
  },
  bigAvatar: {
    width: '104px',
    height: '104px',
  },
})
