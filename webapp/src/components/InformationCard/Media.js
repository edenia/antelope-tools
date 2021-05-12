import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'

const Media = ({ media }) => {
  return (
    <>
      <img
        src={media.logo || generalConfig.defaultProducerLogo}
        onError={onImgError(generalConfig.defaultProducerLogo)}
        alt="avatar"
      />
      <Typography className="bpName">{media.name}</Typography>
      <Typography>{media.account}</Typography>
    </>
  )
}

Media.propTypes = {
  media: PropTypes.object
}

Media.defaultProps = {
  media: {}
}

export default memo(Media)
