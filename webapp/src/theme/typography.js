import { EOSCR_THEME } from '@eoscostarica/eoscr-theme'

import palette from './palette'

export default {
  h1: {
    ...EOSCR_THEME.typography.h1,
    color: palette.text.primary
  },
  h2: {
    ...EOSCR_THEME.typography.h2,
    color: palette.text.primary
  },
  h3: {
    ...EOSCR_THEME.typography.h3,
    color: palette.text.primary
  },
  h4: {
    color: palette.text.primary,
    ...EOSCR_THEME.typography.h4
  },
  h5: {
    color: palette.text.primary,
    ...EOSCR_THEME.typography.h5
  },
  h6: {
    color: palette.text.primary,
    ...EOSCR_THEME.typography.h6
  },
  subtitle1: {
    ...EOSCR_THEME.typography.subtitle1,
    color: palette.text.primary
  },
  subtitle2: {
    ...EOSCR_THEME.typography.subtitle2,
    color: palette.text.secondary
  },
  body1: {
    ...EOSCR_THEME.typography.body1,
    color: palette.text.primary
  },
  body2: {
    ...EOSCR_THEME.typography.body1,
    color: palette.text.secondary
  },
  button: {
    ...EOSCR_THEME.typography.button,
    color: palette.text.primary
  },
  caption: {
    ...EOSCR_THEME.typography.caption,
    color: palette.text.secondary
  },
  overline: {
    ...EOSCR_THEME.typography.overline,
    color: palette.text.secondary
  }
}
