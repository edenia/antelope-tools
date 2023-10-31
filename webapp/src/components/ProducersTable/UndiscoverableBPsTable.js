/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import NonCompliantCard from '../../components/NonCompliantCard'

import styles from './styles'

const useStyles = makeStyles(styles)

const UndiscoverableBPsTable = ({ producers, tokenPrice }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const columnsNames = [
    'rank',
    'producerName',
    'website',
    'bpJson',
    'votes',
    'lastClaimTime',
    'dailyRewards',
    'yearlyRewards',
  ]

  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.tableHead}>
          <TableRow>
            {columnsNames.map((name) => (
              <TableCell align="center" key={name}>
                <Typography variant="capSubtitle">{t(name)}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {producers.map((producer, index) => (
            <TableRow
              className={classes.tableRow}
              key={`bp-${producer?.owner}-${index}`}
            >
              <NonCompliantCard producer={producer} tokenPrice={tokenPrice} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

UndiscoverableBPsTable.propTypes = {
  producers: PropTypes.array,
}

UndiscoverableBPsTable.defaultProps = {
  producers: [],
}

export default UndiscoverableBPsTable
