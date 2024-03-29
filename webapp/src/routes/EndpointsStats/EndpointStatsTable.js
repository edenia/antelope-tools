/* eslint camelcase: 0 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const EndpointsTable = ({ endpoints, title }) => {
  const { t } = useTranslation('EndpointsStatsRoute')

  const formatValue = value => {
    return Number.isInteger(value) ? value : value.toFixed(2)
  }

  return (
    <>
      <Typography component="h2" variant="h6">
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Endpoint')}</TableCell>
              <TableCell align="right">{t('avgAvailability')}</TableCell>
              <TableCell align="right">{t('avgTime')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endpoints.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.value}</TableCell>
                <TableCell align="right">{`${formatValue(
                  item.availability / (item?.total || 1),
                )}%`}</TableCell>
                <TableCell align="right">{`${formatValue(
                  item.avg_time / (item?.total || 1),
                )} s`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default EndpointsTable
