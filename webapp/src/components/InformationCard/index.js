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
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import moment from 'moment'
import 'flag-icon-css/css/flag-icon.min.css'

import { onImgError } from '../../utils'
import { generalConfig, eosConfig } from '../../config'
import CountryFlag from '../CountryFlag'
import ProducerSocialLinks from '../ProducerSocialLinks'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import styles from './styles'

const useStyles = makeStyles(styles)

const InformationCard = ({ producer, rank, onNodeClick }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation('producerCardComponent')
  const matches = useMediaQuery(theme.breakpoints.up('lg'))
  const [expanded, setExpanded] = useState(false)
  const [producerOrg, setProducerOrg] = useState({})
  const [producerNodes, setProducerNodes] = useState([])
  const [cardTitle, setCardTitle] = useState(null)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    if (producer.bp_json?.org) {
      if (eosConfig.networkName === 'lacchain') {
        setCardTitle(`${t(`entityType${producer.bp_json.type}`)} Entity`)
      } else {
        setCardTitle(rank ? `Rank #${rank} -Top` : 'No Rank')
      }
    }
    setProducerOrg(producer.bp_json?.org || {})
    setProducerNodes(producer.bp_json?.nodes || [])
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader title={cardTitle} />
      <Box className={classes.wrapper}>
        <Box className={classes.media}>
          <img
            src={
              producerOrg.branding?.logo_256 ||
              generalConfig.defaultProducerLogo
            }
            onError={onImgError(generalConfig.defaultProducerLogo)}
            alt="avatar"
          />
          <Typography className="bpName">
            {producerOrg.candidate_name ||
              producerOrg.organization_name ||
              producer.owner}
          </Typography>
          <Typography>12letteracco</Typography>
        </Box>
        <Collapse in={matches ? true : expanded} timeout="auto" unmountOnExit>
          <Box className="bodyWrapper">
            <Box className={classes.info}>
              <Typography variant="overline">Info</Typography>
              <Typography variant="body1">
                Location:{` ${producerOrg.location?.name || 'N/A'} `}
                <CountryFlag code={producerOrg.location?.country} />
              </Typography>
              <Typography variant="body1">
                Website:{' '}
                <Link
                  href={producerOrg.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producerOrg.website}
                </Link>
              </Typography>
              <Typography variant="body1">
                Email:{' '}
                {producerOrg.email ? (
                  <Link
                    href={`mailto:${producerOrg.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {producerOrg.email}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography variant="body1">
                Onwership Disclosure:{' '}
                {producerOrg.chain_resources ? (
                  <Link
                    href={producerOrg.chain_resources}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {producerOrg.ownership_disclosure}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography variant="body1">
                Chain Resources:{' '}
                {producerOrg.chain_resources ? (
                  <Link
                    href={producerOrg.chain_resources}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {producerOrg.chain_resources}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
            </Box>
            <Box className={classes.twoBoxes}>
              <Box className="stats">
                <Typography variant="overline">Stats</Typography>
                {eosConfig.networkName !== 'lacchain' && (
                  <>
                    <Typography variant="body1">Votes: N/A</Typography>
                    <Typography variant="body1">Rewards: 0 eos</Typography>
                  </>
                )}
                <Typography variant="body1">
                  Last Checked:
                  {` ${moment(new Date()).diff(
                    moment(producer.updated_at),
                    'seconds'
                  )} ${t('secondsAgo')}`}
                </Typography>
                <Typography variant="body1">
                  Missed Blocks:{' '}
                  {(producer.missed_blocks || []).reduce(
                    (result, current) => result + current.value,
                    0
                  )}
                </Typography>
              </Box>
              <Box className="nodes">
                <Typography variant="overline">{t('nodes')}</Typography>
                <Box>
                  {producerNodes.length > 0 && (
                    <>
                      {producerNodes.map((node, i) => (
                        <Typography variant="body1" key={`node-${i}`}>
                          {node.node_name || node.node_type}{' '}
                          <InfoOutlinedIcon
                            onClick={onNodeClick({ node, producer })}
                          />
                        </Typography>
                      ))}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
            <Box className={classes.twoBoxes}>
              <Box className="healthStatus">
                <Typography variant="overline">Health</Typography>
                <ProducerHealthIndicators producer={producer} />
              </Box>
              <Box className="social">
                <Typography variant="overline">Social</Typography>
                <Box>
                  <ProducerSocialLinks items={producerOrg.social || {}} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
      <CardActions disableSpacing className={classes.cardActions}>
        <Box className={classes.expandMore}>
          <Button color="primary" onClick={handleExpandClick}>
            {expanded ? 'Collapse' : 'More Info'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}

InformationCard.propTypes = {
  producer: PropTypes.any,
  rank: PropTypes.number,
  onNodeClick: PropTypes.func
}

InformationCard.defaultProps = {
  producer: {},
  rank: 0,
  onNodeClick: () => {}
}

export default memo(InformationCard)
