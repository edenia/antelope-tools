/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import 'flag-icon-css/css/flag-icon.min.css'

import { generalConfig } from '../config'
import { onImgError } from '../utils'

import CountryFlag from './CountryFlag'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  content: {
    flex: 1
  },
  avatar: {
    borderRadius: '100%',
    backgroundColor: theme.palette.primary.contrastText
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  bold: {
    fontWeight: 'bold'
  },
  breakLine: {
    wordBreak: 'break-word'
  }
}))

const NodeCard = ({ producer, node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeSummary')
  const [producerOrg, setProducerOrg] = useState({})

  useEffect(() => {
    setProducerOrg(producer.bp_json?.org || {})
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <img
            width="30px"
            height="30px"
            className={classes.avatar}
            src={
              producerOrg.branding?.logo_256 ||
              generalConfig.defaultProducerLogo
            }
            onError={onImgError(generalConfig.defaultProducerLogo)}
            alt="avatar"
          />
        }
        title={
          producerOrg.candidate_name ||
          producerOrg.organization_name ||
          producer.owner
        }
        subheader={
          <>
            <CountryFlag code={producerOrg.location?.country} />
            <span className={classes.country}>
              {producerOrg.location?.name || 'N/A'}
            </span>
          </>
        }
      />
      <CardContent className={classes.content}>
        <dl className={classes.dl}>
          {node?.node_name && (
            <>
              <dt className={classes.bold}>{t('nodeName')}</dt>
              <dd>{node?.node_name}</dd>
            </>
          )}

          <dt className={classes.bold}>{t('nodeType')}</dt>
          <dd>{node?.node_type || 'N/A'}</dd>

          {node.features && (
            <>
              <dt className={classes.bold}>{t('features')}</dt>
              {node.features.map((feature, i) => (
                <dd key={i}>{feature}</dd>
              ))}
            </>
          )}

          {node.endpoints && (
            <>
              <dt className={classes.bold}>{t('endpoints')}</dt>
              {Object.keys(node.endpoints).map((key, i) => (
                <dd key={i}>
                  <span className={classes.bold}>{key}</span>:{' '}
                  {node.endpoints[key]}
                </dd>
              ))}
            </>
          )}

          {node.keys && (
            <>
              <dt className={classes.bold}>{t('keys')}</dt>
              {Object.keys(node.keys).map((key, i) => (
                <dd key={i}>
                  <span className={classes.bold}>{key}</span>:{' '}
                  <span className={classes.breakLine}>{node.keys[key]}</span>
                </dd>
              ))}
            </>
          )}
        </dl>
      </CardContent>
      <CardActions disableSpacing />
    </Card>
  )
}

NodeCard.propTypes = {
  producer: PropTypes.any,
  node: PropTypes.any
}
export default NodeCard
