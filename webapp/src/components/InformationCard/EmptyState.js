import React, { memo } from 'react'
import PropTypes from 'prop-types'

const EmptyState = ({ classes, t }) => {
  return (
    <div className={`${classes.centerWrapper} ${classes.borderLine}`}>
      <div className={classes.emptyState}>
        <div className={classes.horizontalLine}></div>
        <img
          className={classes.imgError}
          src="/empty-states/Error.webp"
          loading="lazy"
          alt=""
        />
        <span>{t('emptyState')}</span>
      </div>
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
