export default (theme) => ({
  dropdown: {
    position: 'relative',
    width: 200,
    marginTop: 35,
    '& img': {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor: theme.palette.primary.contrastText
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
      width: 220
    },
    '&:hover': {
      cursor: 'pointer'
    }
  },
  list: {
    transition: 'max-height .6s ease-out',
    maxHeight: 0,
    overflow: 'hidden',
    margin: 0,
    position: 'absolute',
    zIndex: 2,
    padding: 0,
    width: 186,
    top: 48,
    left: 7,
    border: `1px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.up('sm')]: {
      width: 165
    }
  },
  listActive: {
    maxHeight: 1000,
    opacity: 1
  },
  listItem: {
    borderTop: `1px solid ${theme.palette.primary.main}`,
    cursor: 'pointer',
    listStyle: 'none',
    padding: 15,
    background: theme.palette.primary.contrastText,

    '&:hover': {
      background: '#f4f4f4'
    }
  },
  listItemActive: {
    background: theme.palette.primary.contrastText
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(2),
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 22,
      borderRadius: theme.spacing(2, 4, 4, 2),
      justifyContent: 'space-between'
    }
  },
  networkLogo: {
    border: `2px solid ${theme.palette.primary.main}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: '100%',
    zIndex: 2,
    position: 'absolute',
    right: 70,
    top: -45,
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      right: -10,
      top: -3
    }
  }
})
