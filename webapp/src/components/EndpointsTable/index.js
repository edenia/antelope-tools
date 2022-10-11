import React from 'react'
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

import HealthCheck from '../HealthCheck'

import styles from './styles'
import EndpointInfo from './EndpointInfo'

const useStyles = makeStyles(styles)

const EndpointsTable = ({ producers }) => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')

  const getStatus = (endpoint) => {
    if (endpoint.response.status === undefined) return

    if ((new Date() - new Date(endpoint.head_block_time)) / 60000 <= 3) {
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
                  <EndpointInfo endpoint={endpoint}/>
                </HealthCheck>
              )}
            </div>
          ))
        )}
      </TableCell>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('producer')}</TableCell>
            <TableCell>{t('api')}</TableCell>
            <TableCell>{t('ssl')}</TableCell>
            <TableCell>{t('p2p')}</TableCell>
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
  )
}

EndpointsTable.propTypes = {
  producers: PropTypes.array,
}

export default EndpointsTable
