/* eslint camelcase: 0 */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSubscription } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import 'flag-icon-css/css/flag-icon.min.css'
import { useTranslation } from 'react-i18next'

import ProducerCard from '../../components/ProducerCard'
import { PRODUCERS_SUBSCRIPTION } from '../../gql'

const Producers = () => {
  const dispatch = useDispatch()
  const {
    loading = true,
    data: { producer: producers = [] } = { producers: [] }
  } = useSubscription(PRODUCERS_SUBSCRIPTION)
  const { t } = useTranslation('dashboardProducer')

  useEffect(() => {
    return () => {
      dispatch.eos.stopTrackingInfo()
      dispatch.eos.stopTrackingProducerSchedule()
    }
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <Typography variant="h1">{t('title')}</Typography>
      {loading && <LinearProgress />}
      <Grid container justify="flex-start" spacing={1}>
        {producers.map((producer, index) => (
          <Grid item xs={3} key={`producer-card-${index}`}>
            <ProducerCard producer={producer} rank={index + 1} />
          </Grid>
        ))}
        {loading &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <Grid item xs={3} key={`producer-card-${index}`}>
              <Skeleton variant="rect" width={300} height={260} />
            </Grid>
          ))}
      </Grid>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
