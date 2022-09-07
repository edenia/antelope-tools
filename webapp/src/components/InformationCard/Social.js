import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import ProducerSocialLinks from '../ProducerSocialLinks'

const Social = ({ social, type, t, classes }) => {
  if (type === 'node') return <></>

  return (
    <div className={classes.social}>
      <Typography variant="overline">{t('social')}</Typography>
      <div className={classes.borderLine}>
        <ProducerSocialLinks items={social} message={t('noData')} />
      </div>
    </div>
  )
}

Social.propTypes = {
  social: PropTypes.object,
  t: PropTypes.func,
  classes: PropTypes.object,
  type: PropTypes.string
}

Social.defaultProps = {
  type: '',
  social: {},
  classes: {}
}

export default memo(Social)
