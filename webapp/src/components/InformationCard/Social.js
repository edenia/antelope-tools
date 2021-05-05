import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import ProducerSocialLinks from '../ProducerSocialLinks'

const Social = ({ social, type, t }) => {
  if (type === 'node') return <></>

  return (
    <Box className="social">
      <Typography variant="overline">{t('social')}</Typography>
      <Box>
        <ProducerSocialLinks items={social} />
      </Box>
    </Box>
  )
}

Social.propTypes = {
  social: PropTypes.object,
  t: PropTypes.func,
  type: PropTypes.string
}

Social.defaultProps = {
  type: '',
  social: {}
}

export default memo(Social)
