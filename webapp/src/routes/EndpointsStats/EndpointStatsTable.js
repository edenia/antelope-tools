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

import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsTable = ({endpoints, title}) => {
  const { t } = useTranslation('EndpointsStatsRoute')
  const classes = useStyles()

  return (
    <>
      <Typography component="p" variant="h6">
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Endpoint')}</TableCell>
              <TableCell align="right">{t('Average Availability')}</TableCell>
              <TableCell align="right">{t('Average Response Time')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endpoints.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.value}</TableCell>
                <TableCell align="right">{`${item.availability}%`}</TableCell>
                <TableCell align="right">{`${item.avg_time.toFixed(3)} s`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default EndpointsTable
