/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSubscription } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'

import ProducerCard from '../../components/ProducerCard'
import { PRODUCERS_SUBSCRIPTION } from '../../gql'
import PageTitle from '../../components/PageTitle'

const useStyles = makeStyles((theme) => ({
  linearProgress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const [uniqueProducers, setUniqueProducers] = useState([])
  const classes = useStyles()
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

  useEffect(() => {
    let uniqueProducers = {}
    producers.forEach((producer) => {
      const id =
        producer?.bp_json?.org?.candidate_name ||
        producer?.bp_json?.organization_name ||
        producer.owner
      const previousEntity = uniqueProducers[id]
      let missedBlocks = producer.missed_blocks
      let cpus = producer.cpus

      if (previousEntity) {
        missedBlocks = [...previousEntity.missed_blocks, ...missedBlocks]
        cpus = [...previousEntity.cpus, ...cpus]
      }

      const { org, ...bpJson } = producer.bp_json || {}
      let newBpJson = bpJson

      if (org) {
        newBpJson = { ...newBpJson, ...org }
      }

      uniqueProducers = {
        ...uniqueProducers,
        [id]: {
          ...producer,
          cpus,
          missed_blocks: missedBlocks,
          bp_json: newBpJson
        }
      }
    })
    setUniqueProducers(Object.values(uniqueProducers))
  }, [producers])

  return (
    <Grid item xs={12}>
      <PageTitle title={t('htmlTitle')} />
      <Typography variant="h3">{t('title')}</Typography>
      {loading && <LinearProgress className={classes.linearProgress} />}
      <Grid container justify="flex-start" spacing={1}>
        {uniqueProducers.map((producer, index) => (
          <Grid item xs={12} sm={6} md={3} key={`producer-card-${index}`}>
            <ProducerCard producer={producer} rank={index + 1} />
          </Grid>
        ))}
        {loading &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <Grid item xs={12} sm={6} md={3} key={`producer-card-${index}`}>
              <Skeleton variant="rect" width={280} height={560} />
            </Grid>
          ))}
      </Grid>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
