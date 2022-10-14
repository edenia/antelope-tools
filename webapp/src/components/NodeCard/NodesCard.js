/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useSubscription } from '@apollo/client'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import 'flag-icon-css/css/flag-icons.css'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import CountryFlag from '../CountryFlag'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import Features from './Features'
import Keys from './Keys'
import ShowInfo from './ShowInfo'
import styles from './styles'

const useStyles = makeStyles(styles)

const NodesCard = ({ nodes }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!nodes?.length) return

  const HealthStatus = ({ node }) => {
    const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
    const [missedBlocks, setMissedBlocks] = useState({})

    useEffect(() => {
      if (data?.stats?.length) {
        setMissedBlocks(data.stats[0].missed_blocks)
      }
    }, [data, loading])

    if (!node?.health_status?.length) return <></>

    return (
      <>
        <dt className={classes.bold}>{t('healthStatus')}</dt>
        <dd>
          {missedBlocks && `${t('missedBlocks')}: ${missedBlocks}`}
          <ProducerHealthIndicators producer={node} />
        </dd>
      </>
    )
  }

  const Endpoints = ({ node }) => {
    if (!node?.endpoints?.length) {
      return <></>
    }

    const total = node.endpoints.filter((e) => {
      return e.type !== 'p2p'
    })?.length

    return (
      <>
        <dt className={classes.bold}>{t('endpoints')}</dt>
        {total > 0 && (
          <dd>{`Responding: ${node.info?.endpoints?.count}/${total}`}</dd>
        )}
        {node.endpoints.map(({ type, value }, index) => (
          <dd key={`endpoint-${type}-${value}-${index}`}>
            <span>{type.toUpperCase()}</span>:{' '}
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value || 'N/A'}
            </a>
          </dd>
        ))}
      </>
    )
  }

  const NodeInfo = ({ node }) => {
    return (
      <>
        <ShowInfo value={node?.full} title={t('isFull')} />
        <ShowInfo value={node?.node_info?.version} title={t('nodeVersion')} />
        <Endpoints node={node} />
        <Features node={node} />
        <Keys node={node} />
        <HealthStatus node={node} />
      </>
    )
  }

  return (
    <div className={classes.nodesWrapper}>
      <div className={classes.nodesContainer}>
        {(nodes || []).map((node, index) => (
          <Card key={`node-${index}`} className={classes.nodes} elevation={0}>
            <CardHeader
              className={classes.cardHeader}
              title={node.type?.toString() || ''}
              subheader={
                <>
                  <span className={classes.country}>
                    {node.location?.name || 'N/A'}
                  </span>
                  <CountryFlag code={node.location?.country} />
                </>
              }
            />
            <CardContent className={classes.content}>
              <NodeInfo node={node} />
            </CardContent>
            <CardActions disableSpacing />
          </Card>
        ))}
      </div>
    </div>
  )
}

NodesCard.propTypes = {
  nodes: PropTypes.array,
}
export default NodesCard
