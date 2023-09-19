/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { NODES_SUMMARY_QUERY } from '../../gql'
import { eosConfig } from '../../config'
import SimpleDataCard from '../SimpleDataCard'

const NODES_ORDER = [
  {
    boot: 2,
    observer: 4,
    validator: 1,
    writer: 3,
  },
  {
    producer: 1,
    full: 2,
    query: 3,
    seed: 4,
    'query,seed': 5,
    unknown: 10,
  },
]

const NodesSummary = ({ t }) => {
  const { data, loading } = useQuery(NODES_SUMMARY_QUERY)
  const [total, setTotal] = useState()
  const [nodes, setNodes] = useState()

  useEffect(() => {
    if (!data?.stats) {
      return
    }

    const { total, ...nodes } = data?.stats[0]?.nodes_summary || {}

    setTotal(total)

    const nodesOrderByNet = eosConfig.networkName === 'lacchain'
      ? NODES_ORDER[0]
      : NODES_ORDER[1]
    const sortedNodes = Object.keys(nodes)
      .map((node) => {
        let type = node

        if (type.includes('[')) {
          const arrayName = JSON.parse(type)

          type = arrayName.toString()
        }

        return {
          value: nodes[type],
          type,
          position: nodesOrderByNet[type] || 8,
        }
      })
      .sort((a, b) => a.position - b.position)

    setNodes(sortedNodes)
  }, [data])

  return (
    <>
      <SimpleDataCard
        title={`${t('total')} ${t('nodes')}`}
        helperText={t('tooltip.nodes')}
        value={total}
        loading={loading}
      />
      {nodes &&
        nodes.map((node) => (
          <SimpleDataCard
            key={node.type}
            helperText={
              eosConfig.networkName !== 'lacchain' &&
              eosConfig.nodeTypes
                .map((nodeType) => nodeType.name)
                .includes(node.type)
                ? t(`tooltip.${node.type}`)
                : ''
            }
            title={t('nodeType', { nodeType: node.type })}
            value={node.value || 0}
            loading={loading}
          />
        ))}
    </>
  )
}

NodesSummary.propTypes = {
  t: PropTypes.func,
}

NodesSummary.defaultProps = {
  t: (text) => text,
}

export default memo(NodesSummary)
