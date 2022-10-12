/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import Typography  from '@mui/material/Typography'

import styles from './styles'

const useStyles = makeStyles(styles)

const ProducerHealthIndicators = ({ producer, message }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerHealthIndicatorsComponent')

  if (!producer.health_status.length) return <Typography>{message}</Typography>

  return (
    <div>
      {producer.health_status.map((item, index) => (
        <Tooltip
          key={`health-indicator-${index}`}
          title={t(`hs_${item.name}`)}
          aria-label="add"
        >
          <div className={classes.wrapper}>
            <Typography>{`${t(`hs_${item.name}`)}: ${
              item.valid ? t('found') : t('missing')
            }`}</Typography>
            {item.valid && <DoneOutlinedIcon className="success" />}
            {!item.valid && <ReportProblemOutlinedIcon className="warning" />}
          </div>
        </Tooltip>
      ))}
    </div>
  )
}

ProducerHealthIndicators.propTypes = {
  producer: PropTypes.any,
  message: PropTypes.string
}

export default ProducerHealthIndicators
