import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import ProducerSocialLinks from '../ProducerSocialLinks'

const Social = ({ social, type, t, classes }) => {
  if (type === 'node') return <></>

  return (
    <Box className={classes.social}>
      <Typography variant="overline">{t('social')}</Typography>
      <Box className={classes.borderLine}>
        <ProducerSocialLinks items={social} message={t('noData')} />
      </Box>
    </Box>
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
