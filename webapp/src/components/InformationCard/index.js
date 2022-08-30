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
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import 'flag-icon-css/css/flag-icons.css'

import { formatData, formatWithThousandSeparator } from '../../utils'
import { eosConfig } from '../../config'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import Information from './Information'
import Nodes from './Nodes'
import Social from './Social'
import Media from './Media'
import Stats from './Stats'
import Endpoints from './Endpoints'
import styles from './styles'

const useStyles = makeStyles(styles)

const InformationCard = ({ producer, rank, onNodeClick, type }) => {
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
      <Box className={classes.rowWrapper}>
        <Typography variant="body1">
          {`${t('missedBlocks')}: `}
          {(producer.missed_blocks || []).reduce(
            (result, current) => result + current.value,
            0
          )}
        </Typography>
      </Box>
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
          missedBlocks: producer.missedBlocks || [],
          nodes: producer.bp_json?.nodes || [],
          healthStatus: producer.health_status,
          dataType: producer.bp_json?.type,
          node: producer.node,
          totalRewards: producer.total_rewards
        },
        type,
        t
      )
    )
    // eslint-disable-next-line
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader title={producerOrg.title} />
      <Box className={classes.wrapper}>
        <Box className={classes.media}>
          <Media classes={classes} media={producerOrg.media || {}} />
        </Box>
        <Collapse
          in={matches ? true : expanded}
          timeout="auto"
          unmountOnExit
          className={classes.collapse}
        >
          <Box className="bodyWrapper">
            <Box className={clsx(classes.info, classes[type])}>
              <Typography variant="overline">{t('info')}</Typography>
              <Information
                info={producerOrg.info}
                classes={classes}
                t={t}
                type={type}
              />
            </Box>
            <Stats
              t={t}
              type={type}
              classes={classes}
              missedBlocks={producer.missed_blocks || []}
              votes={formatWithThousandSeparator(
                producer.total_votes_eos || '0',
                0
              )}
              rewards={formatWithThousandSeparator(
                producer.total_rewards || '0',
                0
              )}
            />
            <Endpoints
              endpoints={producerOrg.endpoints}
              classes={classes}
              t={t}
              type={type}
            />
            <Nodes
              nodes={producerOrg.nodes}
              producer={producer}
              t={t}
              onNodeClick={onNodeClick}
              type={type}
              classes={classes}
            />
            <Box className={classes.healthStatus}>
              <Typography variant="overline">{t('health')}</Typography>
              <Box className={classes.borderLine}>
                {missedBlock(producer, producerOrg?.media?.account, type)}
                <ProducerHealthIndicators
                  message={t('noData')}
                  producer={
                    producerOrg?.healthStatus
                      ? { health_status: producerOrg.healthStatus }
                      : { health_status: [] }
                  }
                />
              </Box>
            </Box>
            <Social
              social={producerOrg?.social || {}}
              type={type}
              t={t}
              classes={classes}
            />
          </Box>
        </Collapse>
      </Box>
      <CardActions disableSpacing className={classes.cardActions}>
        <Box className={classes.expandMore}>
          <Button color="primary" onClick={handleExpandClick}>
            {expanded ? t('collapse') : t('moreInfo')}
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}

InformationCard.propTypes = {
  producer: PropTypes.any,
  rank: PropTypes.number,
  onNodeClick: PropTypes.func,
  type: PropTypes.string
}

InformationCard.defaultProps = {
  producer: {},
  rank: 0,
  onNodeClick: () => {},
  type: ''
}

export default memo(InformationCard)
