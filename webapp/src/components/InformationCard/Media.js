import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'
import isLogoValid from '../../utils/validate-image'

const Media = ({ media }) => {
  return (
    <>
      <img
        loading="lazy"
        src={isLogoValid(media.logo) ? media.logo : generalConfig.defaultProducerLogo}
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
