/* eslint camelcase: 0 */
import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import { useTranslation } from 'react-i18next'

import { PRODUCERS_QUERY } from '../gql'
import ProducerCard from '../components/ProducerCard'
import PageTitle from '../components/PageTitle'
import Tooltip from '../components/Tooltip'
import NodeCard from '../components/NodeCard'

const useStyles = makeStyles((theme) => ({
  linearProgress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

const Producers = () => {
  const classes = useStyles()
  const { loading = true, data: { producer: producers } = {} } = useQuery(
    PRODUCERS_QUERY
  )
  const { t } = useTranslation('dashboardProducer')
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (node) => (event) => {
    setCurrent(node)
    setAnchorEl(event.currentTarget)
    console.log(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <PageTitle title={t('htmlTitle')} />
      <Typography variant="h3">{t('title')}</Typography>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <NodeCard node={current?.node} producer={current?.producer} />
      </Tooltip>
      {loading && <LinearProgress className={classes.linearProgress} />}
      <Grid container spacing={2}>
        {(producers || []).map((producer, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`producer-card-${index}`}
          >
            <ProducerCard
              producer={producer}
              rank={index + 1}
              onNodeClick={handlePopoverOpen}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

Producers.propTypes = {}

export default Producers
