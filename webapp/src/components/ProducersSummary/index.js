/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

import { ENTITY_TYPE } from '../../utils/lacchain'
import { eosConfig } from '../../config'
import SimpleDataCard from '../SimpleDataCard'

const BodyGraphValue = ({ loading, value }) => {
  if (loading) return <LinearProgress />

  return (
    <Typography component="p" variant="h6">
      {value}
    </Typography>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.number,
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false,
}

const ProducersSummary = ({ t, data, loading, total }) => {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    if (!data?.producers_summary?.length) return

    const producers = []

    for (let index = 0; index < data?.producers_summary?.length; index++) {
      const producer = data?.producers_summary[index]

      if (eosConfig.networkName !== 'lacchain') {
        continue
      }

      producers.push({
        ...producer,
        type: ENTITY_TYPE[producer.type] || 'N/A',
      })
    }

    setNodes(producers)
  }, [data])

  return (
    <>
      <SimpleDataCard>
        <Typography>{`${t('total')} ${t('producers')}`}</Typography>
        <BodyGraphValue value={total} loading={loading} />
      </SimpleDataCard>

      {nodes.map((node, index) => (
        <SimpleDataCard key={index}>
          <Typography>{`${t(node.type)} ${t('producers')}`}</Typography>
          <BodyGraphValue value={node.entities_count || 0} loading={loading} />
        </SimpleDataCard>
      ))}
    </>
  )
}

ProducersSummary.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  loading: PropTypes.bool,
  total: PropTypes.number,
}

ProducersSummary.defaultProps = {
  t: (text) => text,
  data: {},
  loading: false,
  total: 0,
}

export default memo(ProducersSummary)
