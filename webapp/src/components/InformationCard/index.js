/* eslint camelcase: 0 */
import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import 'flag-icon-css/css/flag-icon.min.css'

import { formatData } from '../../utils'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import Information from './Information'
import Nodes from './Nodes'
import Social from './Social'
import Stats from './Stats'
import Media from './Media'
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

  useEffect(() => {
    if (producer.bp_json?.org) {
      setProducerOrg(
        formatData(
          {
            data: producer.bp_json.org,
            rank,
            owner: producer.owner,
            updatedAt: producer.updated_at,
            missedBlocks: producer.missed_blocks || [],
            nodes: producer.bp_json?.nodes || [],
            healthStatus: producer.health_status,
            dataType: producer.bp_json.type,
            node: producer.node
          },
          type
        )
      )
    }
    // eslint-disable-next-line
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader
        title={
          type === 'node'
            ? producerOrg.title
            : `${t(`entityType${producerOrg.title}`)} Entity`
        }
      />
      <Box className={classes.wrapper}>
        <Media classes={classes} media={producerOrg.media || {}} />
        <Collapse in={matches ? true : expanded} timeout="auto" unmountOnExit>
          <Box className="bodyWrapper">
            <Information
              info={producerOrg.info}
              classes={classes}
              t={t}
              type={type}
            />
            <Endpoints
              endpoints={producerOrg.endpoints}
              classes={classes}
              t={t}
              type={type}
            />
            <Box className={classes.twoBoxes}>
              <Stats
                updatedAt={producer.updated_at}
                missedBlocks={producer.missed_blocks || []}
                t={t}
              />
              <Nodes
                nodes={producerOrg.nodes}
                producer={producer}
                t={t}
                onNodeClick={onNodeClick}
                type={type}
              />
            </Box>
            <Box className={classes.twoBoxes}>
              <Box className="healthStatus">
                <Typography variant="overline">{t('health')}</Typography>
                <ProducerHealthIndicators
                  producer={
                    producerOrg?.healthStatus
                      ? { health_status: producerOrg.healthStatus }
                      : { health_status: [] }
                  }
                />
              </Box>
              <Social social={producerOrg?.social || {}} type={type} t={t} />
            </Box>
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
