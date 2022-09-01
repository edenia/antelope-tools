import React from 'react'
import PropTypes from 'prop-types'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'
import isLogoValid from '../../utils/validate-image'

const ProducerAvatar = ({ logo, name, classes }) => {
  return (
    <img
      loading="lazy"
      className={classes?.avatar}
      src={isLogoValid(logo) ? logo : generalConfig.defaultProducerLogo}
      onError={onImgError(generalConfig.defaultProducerLogo)}
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
