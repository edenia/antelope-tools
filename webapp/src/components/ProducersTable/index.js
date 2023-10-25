/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { eosConfig } from '../../config'

import styles from './styles'
import ProducerRow from './ProducerRow'

const useStyles = makeStyles(styles)

const ProducersTable = ({ producers }) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { t } = useTranslation('producerCardComponent')

  const handleClickRow = producer => {
    navigate(`/${eosConfig.producersRoute}/${producer?.owner}`, {
      state: { producer },
    })
  }

  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.tableHead}>
          <TableRow>
            {eosConfig.producerColumns.map((name) => (
              <TableCell align="center" key={name}>
                <Typography variant="capSubtitle">{t(name)}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {producers.map((producer, index) => (
            <TableRow
              onClick={() => {
                handleClickRow(producer)
              }}
              className={classes.tableRow}
              key={`bp-${producer?.owner}-${index}`}
            >
              <ProducerRow producer={producer} index={index} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

ProducersTable.propTypes = {
  producers: PropTypes.array,
}

ProducersTable.defaultProps = {
  producers: [],
}

export default ProducersTable
