import React from 'react'
import PropTypes from 'prop-types'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'
import useBPLogoState from 'hooks/customHooks/useBPLogoState'

const ProducerAvatar = ({ logo, name, lazy, classes }) => {
  const defaultLogo = generalConfig.defaultProducerLogo
  const [{ src, logoRef }, { handleLoad }] = useBPLogoState(logo, defaultLogo)

  return (
    <img
      loading={lazy ? 'lazy' : 'eager'}
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
  lazy: PropTypes.bool,
  classes: PropTypes.object,
}

ProducerAvatar.defaultProps = {
  lazy: true,
  clases: {},
}

export default ProducerAvatar
