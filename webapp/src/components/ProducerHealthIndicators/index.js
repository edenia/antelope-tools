/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'

import LightIcon from '../HealthCheck/LightIcon'
import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const ProducerHealthIndicators = ({ producer, message }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerHealthIndicatorsComponent')
  const { healthLights } = generalConfig

  if (!producer.health_status.length) return <Typography>{message}</Typography>

  return (
    <>
      {producer.health_status.map((item, index) => (
        <div
          className={classes.wrapper}
          key={`health-indicator-${producer?.owner || ''}-${index}`}
        >
          <Typography>{`${t(`hs_${item.name}`)}`}</Typography>
          {item.valid && <LightIcon status={healthLights.greenLight} />}
          {!item.valid && <LightIcon status={healthLights.redLight} />}
        </div>
      ))}
    </>
  )
}

ProducerHealthIndicators.propTypes = {
  producer: PropTypes.any,
  message: PropTypes.string,
}

export default ProducerHealthIndicators
