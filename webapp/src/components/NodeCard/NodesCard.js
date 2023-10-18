/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'

import ChipList from '../ChipList'
import CountryFlag from '../CountryFlag'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import ShowInfo from './ShowInfo'
import SupportedAPIs from './SupportedAPIs'
import EndpointsChips from './EndpointsChips'
import Keys from './Keys'
import styles from './styles'

const useStyles = makeStyles(styles)

const NodesCard = ({ nodes, hideFeatures = false }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!nodes?.length) return

  const HealthStatus = ({ node }) => {
    if (!node?.health_status?.length) return <></>

    return (
      <>
        <dt className={classes.bold}>{t('healthStatus')}</dt>
        <dd>
          <ProducerHealthIndicators producer={node} />
        </dd>
      </>
    )
  }

  const NodeInfo = ({ node, hideFeatures }) => {
    return (
      <>
        <ShowInfo value={node?.full} title={t('isFull')} />
        {node?.node_info[0]?.version && (
          <div className={classes.version}>
            <div className={classes.bold}>{t('nodeVersion')}</div>
            <Chip
              className={classes.chip}
              size="small"
              variant="outlined"
              label={node?.node_info[0]?.version}
            />
          </div>
        )}
        <EndpointsChips node={node} />
        {!hideFeatures && (
          <>
            <ChipList
              title={t('features')}
              list={node?.node_info[0]?.features?.list}
            />
            <SupportedAPIs list={node?.node_info[0]?.features?.supportedAPIs} />
          </>
        )}
        <Keys node={node} />
        <HealthStatus node={node} />
      </>
    )
  }

  const capitalizeText = (text) => {
    if (!text) return

    return text.substring(0, 1).toUpperCase() + text.substring(1, text.length)
  }

  const getType = (node) => {
    if (!node?.type.length) return ''

    const type = node.type
      .map((nodeType) => {
        return capitalizeText(nodeType)
      })
      .join(', ')

    return type
  }

  const Location = ({ location }) => {
    return (
      <>
        <span>{location?.name || 'N/A'}</span>
        <CountryFlag code={location?.country} />
      </>
    )
  }

  const showLocations = (node) => {
    if (node?.locations?.length) {
      return (
        <>
          {node.locations.map((location, index) => (
            <div
              key={`location-${location?.name}-${node?.type?.join()}-${index}`}
            >
              <Location location={location} />
            </div>
          ))}
        </>
      )
    }

    return <Location location={node.location} />
  }

  return (
    <div className={classes.nodesWrapper}>
      {(nodes || []).map((node, index) => (
        <div key={`node-${index}`} className={classes.nodes}>
          <CardHeader
            className={classes.cardHeader}
            title={getType(node) || ''}
            subheader={showLocations(node)}
          />
          <CardContent className={classes.content}>
            <NodeInfo node={node} hideFeatures={hideFeatures}/>
          </CardContent>
        </div>
      ))}
    </div>
  )
}

NodesCard.propTypes = {
  nodes: PropTypes.array,
  hideFeatures: PropTypes.bool
}
export default NodesCard
