import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import ProducerAvatar from '../ProducerAvatar'

const Media = ({ media }) => {
  return (
    <>
      <ProducerAvatar logo={media.logo} name={media.name} />
      <Typography className="bpName">{media.name}</Typography>
      <Typography>{media.account?.toString()}</Typography>
    </>
  )
}

Media.propTypes = {
  media: PropTypes.object,
}

Media.defaultProps = {
  media: {},
}

export default memo(Media)
