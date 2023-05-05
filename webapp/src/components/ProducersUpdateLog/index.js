import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import Skeleton from '@mui/material/Skeleton'
import moment from 'moment'

import { PRODUCERS_UPDATE_LOG_QUERY } from '../../gql'

import styles from './styles'

const useStyles = makeStyles(styles)

const ProducersUpdateLog = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { loading, data: { updateLogs } = {} } = useQuery(
    PRODUCERS_UPDATE_LOG_QUERY,
  )

  if (loading) return <Skeleton variant="text" width="100%" animation="wave" />

  return (
    <>
      {updateLogs && (
        <div className={classes.updateLogContainer}>
          <span className={classes.dateText}>
            {t('updatedAt')}
            {': '}
            <span>
              {moment(updateLogs?.at(0)?.last_update)?.format('lll')}{' '}
            </span>
          </span>
          <span className={classes.dateText}>
            {t('nextUpdateAt')}
            {': '}
            <span>
              {moment(updateLogs?.at(0)?.next_estimated_update)?.format('lll')}
            </span>
          </span>
        </div>
      )}
    </>
  )
}

export default ProducersUpdateLog
