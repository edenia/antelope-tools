/* eslint camelcase: 0 */
import React, { memo, useState, useEffect } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import 'flag-icon-css/css/flag-icons.css'

import { formatData, formatWithThousandSeparator } from '../../utils'
import { eosConfig } from '../../config'
import ProducerHealthIndicators from '../ProducerHealthIndicators'
import NodesCard from '../NodeCard/NodesCard'

import EmptyState from './EmptyState'
import ProducerInformation from './ProducerInformation'
import Nodes from './Nodes'
import Social from './Social'
import Media from './Media'
import Stats from './Stats'
import styles from './styles'

const useStyles = makeStyles(styles)

const InformationCard = ({ producer, rank, type }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation('producerCardComponent')
  const matches = useMediaQuery(theme.breakpoints.up('lg'))
  const [expanded, setExpanded] = useState(false)
  const [producerOrg, setProducerOrg] = useState({})

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const missedBlock = (producer, nodeType, type) => {
    if (eosConfig.networkName !== 'lacchain') return <></>

    if (type !== 'node' || nodeType !== 'validator') return <></>

    return (
      <div className={classes.rowWrapper}>
        <Typography variant="body1">
          {`${t('missedBlocks')}: `}
          {producer.missed_blocks || 0}
        </Typography>
      </div>
    )
  }

  const BlockProducerInfo = () => {
    const bpJsonHealthStatus = producerOrg.healthStatus.find(
      (status) => status.name === 'bpJson',
    )

    if (!bpJsonHealthStatus?.valid && eosConfig.networkName !== 'lacchain')
      return <EmptyState classes={classes} t={t} />

    return (
      <div className="bodyWrapper">
        <div className={clsx(classes.info, classes[type])}>
          <Typography variant="overline">{t('info')}</Typography>
          <ProducerInformation
            info={producerOrg.info}
            classes={classes}
            t={t}
            type={type}
          />
        </div>
        <Stats
          t={t}
          type={type}
          classes={classes}
          missedBlocks={producer.missed_blocks || 0}
          votes={formatWithThousandSeparator(
            producer.total_votes_eos || '0',
            0,
          )}
          rewards={formatWithThousandSeparator(
            producer.total_rewards || '0',
            0,
          )}
          eosRate={producer?.eosRate}
        />
        <Nodes
          nodes={producerOrg.nodes}
          producer={producer}
          t={t}
          type={type}
          classes={classes}
        />
        <div className={classes.healthStatus}>
          <Typography variant="overline">{t('health')}</Typography>
          <div className={classes.borderLine}>
            {missedBlock(producer, producerOrg?.media?.account, type)}
            <ProducerHealthIndicators
              message={t('noData')}
              producer={
                producerOrg?.healthStatus
                  ? { health_status: producerOrg.healthStatus }
                  : { health_status: [] }
              }
            />
          </div>
        </div>
        <Social
          social={producerOrg?.social || {}}
          type={type}
          t={t}
          classes={classes}
        />
      </div>
    )
  }

  useEffect(() => {
    setProducerOrg(
      formatData(
        {
          data: producer.bp_json?.org || {},
          rank,
          owner: producer.owner,
          updatedAt: producer.updated_at,
          nodes: producer.bp_json?.nodes || [],
          healthStatus: producer.health_status,
          dataType: producer.bp_json?.type,
          totalRewards: producer.total_rewards,
        },
        type,
        t,
      ),
    )
    // eslint-disable-next-line
  }, [producer])

  if (!producerOrg || !Object.keys(producerOrg)?.length) return <></>

  return (
    <Card className={classes.root}>
      <CardHeader title={producerOrg.title} />
      <div
        className={`${classes.wrapper} ${
          type === 'node' ? classes.hideScroll : ''
        }`}
      >
        <div className={classes.media}>
          <Media classes={classes} media={producerOrg.media || {}} />
        </div>
        <Collapse
          in={matches ? true : expanded}
          timeout="auto"
          unmountOnExit
          className={classes.collapse}
        >
          {type === 'node' ? (
            <div className={classes.nodesContainer}>
              <NodesCard nodes={producerOrg.nodes} />{' '}
            </div>
          ) : (
            <BlockProducerInfo />
          )}
        </Collapse>
      </div>
      {!matches && (
        <CardActions disableSpacing className={classes.cardActions}>
          <div className={classes.expandMore}>
            <Button color="primary" onClick={handleExpandClick}>
              {expanded ? t('collapse') : t('moreInfo')}
            </Button>
          </div>
        </CardActions>
      )}
    </Card>
  )
}

InformationCard.propTypes = {
  producer: PropTypes.any,
  rank: PropTypes.number,
  type: PropTypes.string,
}

InformationCard.defaultProps = {
  producer: {},
  rank: 0,
  type: '',
}

export default memo(InformationCard)
