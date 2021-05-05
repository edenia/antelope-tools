import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'

const Media = ({ classes, media }) => {
  return (
    <Box className={classes.media}>
      <img
        src={media.logo || generalConfig.defaultProducerLogo}
        onError={onImgError(generalConfig.defaultProducerLogo)}
        alt="avatar"
      />
      <Typography className="bpName">{media.name}</Typography>
      <Typography>{media.account}</Typography>
    </Box>
  )
}

Media.propTypes = {
  media: PropTypes.object,
  classes: PropTypes.object
}

Media.defaultProps = {
  media: {}
}

export default memo(Media)
