/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { NODES_SUMMARY_QUERY } from '../../gql'
import { generalConfig } from '../../config'

const NODES_ORDER = [
  {
    boot: 2,
    observer: 4,
    validator: 1,
    writer: 3
  },
  {
    producer: 1,
    full: 2,
    query: 3,
    seed: 4,
    'query,seed': 5,
    unknown: 10
  }
]

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
  value: PropTypes.number
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false
}

const NodesSummary = ({ t, classes }) => {
  const { data, loading } = useQuery(NODES_SUMMARY_QUERY)
  const { i18n } = useTranslation('translations')
  const [currentLanguaje, setCurrentLanguaje] = useState('')
  const [total, setTotal] = useState()
  const [nodes, setNodes] = useState()

  useEffect(() => {
    if (!data?.stats) {
      return
    }

    const { total, ...nodes } = data?.stats[0]?.nodes_summary || {}

    setTotal(total)

    const nodesOrderByNet = generalConfig.historyEnabled
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
          position: nodesOrderByNet[type] || 8
        }
      })
      .sort((a, b) => a.position - b.position)

    setNodes(sortedNodes)
  }, [data])

  useEffect(() => {
    setCurrentLanguaje(i18n.language.substring(0, 2))
  }, [i18n.language])

  return (
    <>
      <div className={classes.cardGrow}>
        <Card className={classes.cardShadow}>
          <CardContent className={classes.cards}>
            <Typography>{`${t('total')} ${t('nodes')}`}</Typography>
            <BodyGraphValue value={total} loading={loading} />
          </CardContent>
        </Card>
      </div>

      {nodes &&
        nodes.map((node) => (
          <div className={classes.cardGrow} key={node.type}>
            <Card className={classes.cardShadow}>
              <CardContent className={classes.cards}>
                <Typography>
                  {currentLanguaje === 'es' ? t('nodes') : ''} {t(node.type)}{' '}
                  {currentLanguaje !== 'es' ? t('nodes') : ''}
                </Typography>
                <BodyGraphValue value={node.value || 0} loading={loading} />
              </CardContent>
            </Card>
          </div>
        ))}
    </>
  )
}

NodesSummary.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object
}

NodesSummary.defaultProps = {
  t: (text) => text,
  classes: {}
}

export default memo(NodesSummary)
