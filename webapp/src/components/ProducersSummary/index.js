/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { ENTITY_TYPE } from '../../utils/lacchain'
import { eosConfig } from '../../config'
import SimpleDataCard from '../SimpleDataCard'

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
      <SimpleDataCard
        title={`${t('total')} ${t('producers')}`}
        value={total}
        loading={loading}
      />
      {nodes.map((node, index) => (
        <SimpleDataCard
          key={index}
          title={`${t(node.type)} ${t('producers')}`}
          value={node.entities_count || 0}
          loading={loading}
        />
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
