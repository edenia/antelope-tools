export default (theme) => ({
  icon: {
    '& svg': {
      width: '22px !important',
      height: '22px !important',
      cursor: 'pointer',
    },
  },
  modal: {
    padding: theme.spacing(0, 3, 3),
    display: 'flex',
    flexDirection: 'column',
    '& p': {
      fontWeight: 'bold',
    },
    '& svg': {
      marginRight: theme.spacing(2),
    },
  },
  item: {
    flex: 1,
    display: 'flex',
    alignContent: 'center',
    marginBlock: '2px',
  },
  helpIcon: {
    width: '15px !important',
    height: '15px !important',
    cursor: 'pointer',
  },
  greenLight: {
    color: theme.palette.success.main,
  },
  timerOff: {
    color: 'orange',
  },
  yellowLight: {
    color: theme.palette.warning.main,
  },
  redLight: {
    color: theme.palette.error.main,
  },
  test: {
    boxShadow: '10px 5px 5px red !important',
  },
})
