/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { useTranslation } from 'react-i18next'
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import { Box, Typography } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center'
  }
}))

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
          <Box className={classes.wrapper}>
            <Typography>{`${t(`hs_${item.name}`)}: ${
              item.valid ? t('found') : t('missing')
            }`}</Typography>
            {item.valid && <DoneOutlinedIcon className="success" />}
            {!item.valid && <ReportProblemOutlinedIcon className="warning" />}
          </Box>
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
