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

import HealthCheck from '../HealthCheck'
import { eosConfig } from '../../config'

import styles from './styles'
import EndpointInfo from './EndpointInfo'
import Tooltip from '../Tooltip'
import EndpointsList from '../EndpointsList'

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

  const getStatus = (endpoint) => {
    if (endpoint.response.status === undefined) return

    const diffBlockTimems = new Date() - new Date(endpoint.head_block_time)

    if (diffBlockTimems <= syncToleranceInterval) {
      return 'greenLight'
    } else {
      switch (Math.floor(endpoint.response?.status / 100)) {
        case 2:
          return 'timerOff'
        case 4:
        case 5:
          return 'yellowLight'
        default:
          return 'redLight'
      }
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
                  <EndpointInfo endpoint={endpoint} />
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
        <EndpointsList producers={producers} type={type} />
      </Tooltip>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('producer')}</TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('api')}
                  <MUITooltip title={'Show list'} arrow>
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
                  <MUITooltip title={'Show list'} arrow>
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
                    <MUITooltip title={'Show list'} arrow>
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
                <TableCell>{producer.name}</TableCell>
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
