/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import Tooltip from '@material-ui/core/Tooltip'
import StarIcon from '@material-ui/icons/Star'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const useStyles = makeStyles(() => ({
  valid: {
    color: 'green'
  },
  error: {
    color: 'red'
  },
  warning: {
    color: 'yellow'
  }
}))

const ProducerHealthIndicators = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerHealthIndicators')

  return (
    <>
      <Tooltip
        title={producer.bp_json ? t('bpJsonFound') : t('noBpJsonFound')}
        aria-label="add"
      >
        <StarIcon
          className={clsx({
            [classes.valid]: !!producer.bp_json,
            [classes.error]: !producer.bp_json
          })}
        />
      </Tooltip>
      <Tooltip
        title={producer.ping ? t('apiResponding') : t('apiNotResponding')}
        aria-label="add"
      >
        <StarIcon
          className={clsx({
            [classes.valid]: !!producer.ping,
            [classes.error]: !producer.ping
          })}
        />
      </Tooltip>
      {producer.head_block_time && (
        <Tooltip
          title={
            moment(producer.updated_at).diff(
              producer.head_block_time,
              'minutes'
            ) < 3
              ? t('synced')
              : t('notSyncing')
          }
          aria-label="add"
        >
          <StarIcon
            className={clsx({
              [classes.valid]:
                moment(producer.updated_at).diff(
                  producer.head_block_time,
                  'minutes'
                ) < 3,
              [classes.error]:
                moment(producer.updated_at).diff(
                  producer.head_block_time,
                  'minutes'
                ) >= 3
            })}
          />
        </Tooltip>
      )}
      {!producer.head_block_time && (
        <Tooltip title="Unknow sync status" aria-label="add">
          <StarIcon className={classes.warning} />
        </Tooltip>
      )}
    </>
  )
}

ProducerHealthIndicators.propTypes = {
  producer: PropTypes.any
}

export default ProducerHealthIndicators
