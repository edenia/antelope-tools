import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Tooltip as MUITooltip } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

import HealthCheck from '../HealthCheck'
import HealthCheckInfo from 'components/HealthCheck/HealthCheckInfo'
import { eosConfig } from '../../config'

import styles from './styles'
import Tooltip from '../Tooltip'
import EndpointsTextList from '../EndpointsTextList'

const useStyles = makeStyles(styles)

const EndpointsTable = ({ producers }) => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [anchorEl, setAnchorEl] = useState(null)
  const [type, setType] = useState('')

  const handlePopoverOpen = (target, type) => {
    setAnchorEl(target)
    setType(type)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const syncToleranceInterval = eosConfig.syncToleranceInterval

  const isSynchronized = endpoint => {
    const diffBlockTimems =
      new Date(endpoint.updated_at) - new Date(endpoint.head_block_time)

    return diffBlockTimems <= syncToleranceInterval
  }

  const getStatus = endpoint => {
    if (endpoint.response.status === undefined) return

    switch (Math.floor(endpoint.response?.status / 100)) {
      case 2:
        return !endpoint.head_block_time || isSynchronized(endpoint)
          ? 'greenLight'
          : 'timerOff'
      case 4:
      case 5:
        return 'yellowLight'
      default:
        return 'redLight'
    }
  }

  const CellList = ({ producer, endpointType }) => {
    return (
      <TableCell>
        {!producer?.endpoints[endpointType].length ? (
          <Typography>N/A</Typography>
        ) : (
          producer.endpoints[endpointType].map((endpoint, index) => (
            <div
              className={classes.healthContainer}
              key={`${producer?.name}-${endpointType}-${index}`}
            >
              {endpoint.value}
              {endpointType !== 'p2p' && (
                <HealthCheck status={getStatus(endpoint)}>
                  <HealthCheckInfo healthCheck={endpoint} />
                </HealthCheck>
              )}
            </div>
          ))
        )}
      </TableCell>
    )
  }

  return (
    <>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <EndpointsTextList type={type} />
      </Tooltip>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('producer')}</TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('api')}
                  <MUITooltip title={t('showList')} arrow>
                    <ListAltIcon
                      onClick={(e) => {
                        handlePopoverOpen(e.target, 'api')
                      }}
                    />
                  </MUITooltip>
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('ssl')}
                  <MUITooltip title={t('showList')} arrow>
                    <ListAltIcon
                      onClick={(e) => {
                        handlePopoverOpen(e.target, 'ssl')
                      }}
                    />
                  </MUITooltip>
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('p2p')}
                  <MUITooltip title={t('showList')} arrow>
                    <ListAltIcon
                      onClick={(e) => {
                        handlePopoverOpen(e.target, 'p2p')
                      }}
                    />
                  </MUITooltip>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {producers.map((producer, index) => (
              <TableRow key={`${producer.name}-${index}`}>
                <TableCell>
                  <div className={classes.healthContainer}>
                    {producer.name}
                    {!!producer.endpoints.api.length +
                      producer.endpoints.ssl.length && (
                      <Link
                        component={RouterLink}
                        state={{ producerId: producer.id }}
                        to="/endpoints-stats"
                        color="secondary"
                      >
                        <QueryStatsIcon />
                      </Link>
                    )}
                  </div>
                </TableCell>
                <CellList producer={producer} endpointType={'api'} />
                <CellList producer={producer} endpointType={'ssl'} />
                <CellList producer={producer} endpointType={'p2p'} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

EndpointsTable.propTypes = {
  producers: PropTypes.array,
}

export default EndpointsTable
