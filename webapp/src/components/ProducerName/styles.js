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
    padding: theme.spacing(0, 4, 0)
  },
  smallContainer: {
    width: '170px',
    [theme.breakpoints.down('md')]: {
      width: '150px',
    },
    '& .MuiTypography-h2': {
      fontWeight: 'bold',
      fontSize: '1.5rem',
      [theme.breakpoints.down('xl')]: {
        fontSize: '1rem',
      },
    },
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
