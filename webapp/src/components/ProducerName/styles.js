export default (theme) => ({
  producerNameContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    '& img': {
      borderRadius: '50%',
      aspectRatio: '1 / 1',
      backgroundColor: theme.palette.common.white,
    },
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bigContainer: {
    width: '100%',
    minWidth: '270px',
    padding: theme.spacing(0, 4, 0),
    [theme.breakpoints.down('sm')]: {
      minWidth: '150px',
    },
  },
  smallContainer: {
    width: '140px',
    [theme.breakpoints.down('md')]: {
      width: '120px',
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
    width: '40px',
    height: '40px',
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
