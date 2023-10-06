export default (theme) => ({
  producerNameContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    '& img': {
      borderRadius: '50%',
      aspectRatio: '1 / 1',
    },
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bigContainer: {
    width: '100%',
  },
  smallContainer: {
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
    border: `solid 2px ${theme.palette.primary.main}`,
  },
  bold: {
    fontWeight: 'bold !important',
  }
})
