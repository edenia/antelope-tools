/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { useTranslation } from 'react-i18next'
import WarningIcon from '@material-ui/icons/Warning'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import { Box, Typography } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  valid: {
    color: 'green'
  },
  error: {
    color: 'orange'
  },
  warning: {
    color: 'yellow'
  }
}))

const ProducerHealthIndicators = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerHealthIndicatorsComponent')

  return (
    <div>
      {producer.health_status.map((item, index) => (
        <Tooltip
          key={`health-indicator-${index}`}
          title={t(`hs_${item.name}`)}
          aria-label="add"
        >
          <Box className={classes.wrapper}>
            <Typography>{t(`hs_${item.name}`)}</Typography>
            {item.valid && <DoneAllIcon className={classes.valid} />}
            {!item.valid && <WarningIcon className={classes.error} />}
          </Box>
        </Tooltip>
      ))}
    </div>
  )
}

ProducerHealthIndicators.propTypes = {
  producer: PropTypes.any
}

export default ProducerHealthIndicators
