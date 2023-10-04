import React, { memo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import PropTypes from 'prop-types'

const EmptyState = ({ classes, t }) => {
  return (
    <div className={classes.emptyState}>
      <img
        className={classes.imgError}
        src="/empty-states/Error.webp"
        loading="lazy"
        alt=""
      />
      <span>{t('emptyState')}</span>
      <Link
        component={RouterLink}
        to="/undiscoverable-bps"
        variant="contained"
        color="secondary"
        mt={2}
      >
        {t('viewList')}
      </Link>
    </div>
  )
}

EmptyState.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
}

EmptyState.defaultProps = {
  classes: {},
}

export default memo(EmptyState)
