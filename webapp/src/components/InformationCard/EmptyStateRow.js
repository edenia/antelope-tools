import React, { memo } from 'react'
import PropTypes from 'prop-types'

const EmptyStateRow = ({ classes, t }) => {
  return (
    <div className={classes.emptyStateRow}>
      <img
        src="/empty-states/Alert.webp"
        loading="lazy"
        alt=""
      />
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
