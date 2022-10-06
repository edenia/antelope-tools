import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import HealthCheck from '../../components/HealthCheck'

const EndpointsTable = ({ producers, blockNum }) => {
  const { t } = useTranslation('endpointsListRoute')

  const getStatus = (endpoint) => {
    if(endpoint.response.status === undefined) return

    if( endpoint.head_block_num === blockNum ){
      return 'updated'
    }else{
      switch(Math.floor(endpoint.response.status / 100)){
        case 2:
          return 'outdated'
        case 4:
        case 5:
          return 'error'
        default:
          return 'not working'
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
            <HealthCheck
              status={getStatus(endpoint)}
              key={`${producer?.name}-${endpointType}-${index}`}
            >
              {endpoint.value}
            </HealthCheck>
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
