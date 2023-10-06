import React, { memo } from 'react'
import PropTypes from 'prop-types'

import AlertSvg from 'components/Icons/Alert'

const EmptyStateRow = ({ classes, t }) => {
  return (
    <div className={classes.emptyStateRow}>
      <AlertSvg />
      <span>{t('emptyState')}</span>
    </div>
  )
}

EmptyStateRow.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
}

EmptyStateRow.defaultProps = {
  classes: {},
}

export default memo(EmptyStateRow)
