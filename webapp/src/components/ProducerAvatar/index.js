import React from 'react'
import PropTypes from 'prop-types'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'
import useBPLogoState from 'hooks/customHooks/useBPLogoState'

const ProducerAvatar = ({ logo, name, classes }) => {
  const defaultLogo = generalConfig.defaultProducerLogo
  const [{ src, logoRef }, { handleLoad }] = useBPLogoState(logo, defaultLogo)

  return (
    <img
      loading="lazy"
      className={classes?.avatar}
      src={src}
      ref={logoRef}
      onLoad={handleLoad}
      onError={onImgError(defaultLogo)}
      alt={`${name} logo`}
    />
  )
}

ProducerAvatar.propTypes = {
  logo: PropTypes.string,
  name: PropTypes.string,
  classes: PropTypes.object,
}

ProducerAvatar.defaultProps = {
  clases: {},
}

export default ProducerAvatar
