import { makeStyles } from '@mui/styles'

const Styles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    padding: theme.spacing(4, 4, 0, 4),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  body: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  helpIcon: {
    cursor: 'pointer',
    fontSize: 20,
  },
  tooltip: {
    backgroundColor: 'rgba(97, 97, 97, 0.92)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  tooltipText: {
    color: theme.palette.primary.contrastText,
  },
  titleLabel: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '0.06px',
  },
}))

export default Styles
