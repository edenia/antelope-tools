import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import styles from './styles'

const useStyles = makeStyles(styles)

const ContractTables = ({ accountName, abi, tableData, onGetTableRows }) => {
  const classes = useStyles()
  const [tables, setTables] = useState([])
  const [table, setTable] = useState('')
  const [fields, setFields] = useState([])
  const [scope, setScope] = useState('')
  const [lowerBound, setLowerBound] = useState(null)
  const [upperBound, setUpperBound] = useState(null)
  const [limit, setLimit] = useState(100)
  const { t } = useTranslation('contractTablesComponent')

  const handleTableChange = (value) => {
    setTable(value)

    if (!onGetTableRows) return

    onGetTableRows({
      scope,
      limit,
      table: value,
      code: accountName,
      json: true
    })
  }

  const handleSubmit = (nextKey) => {
    if (!onGetTableRows) return

    onGetTableRows({
      scope,
      limit,
      table,
      code: accountName,
      json: true,
      lower_bound: nextKey || lowerBound,
      upper_bound: upperBound,
      loadMore: !!nextKey
    })
  }

  useEffect(() => {
    if (!abi) {
      setTables([])

      return
    }

    setTables(abi.tables.map((table) => table.name))
  }, [abi])

  useEffect(() => {
    if (!table) {
      setFields([])

      return
    }

    const tableType = abi.tables.find((item) => item.name === table)?.type
    const struct = abi.structs.find((struct) => struct.name === tableType)
    setFields(struct?.fields || [])
  }, [table, abi])

  useEffect(() => {
    setScope(accountName)
    setTable('')
    setLowerBound(null)
    setUpperBound(null)
    setLimit(10)
  }, [accountName])

  return (
    <Box width="100%">
      <div className={classes.form}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="tableLabel">{t('table')}</InputLabel>
          <Select
            labelId="tableLabel"
            id="table"
            value={table}
            onChange={(event) => handleTableChange(event.target.value)}
            label={t('table')}
          >
            {tables.map((item) => (
              <MenuItem key={`table-menu-item-${item}`} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={t('scope')}
          variant="outlined"
          className={classes.formControl}
          value={scope || ''}
          onChange={(event) => setScope(event.target.value)}
        />

        <TextField
          label={t('lowerBound')}
          variant="outlined"
          className={classes.formControl}
          value={lowerBound || ''}
          onChange={(event) => setLowerBound(event.target.value)}
        />

        <TextField
          label={t('upperBound')}
          variant="outlined"
          className={classes.formControl}
          value={upperBound || ''}
          onChange={(event) => setUpperBound(event.target.value)}
        />

        <TextField
          label={t('limit')}
          variant="outlined"
          className={classes.formControl}
          value={limit || 100}
          onChange={(event) =>
            setLimit(
              isNaN(event.target.value)
                ? 100
                : parseInt(event.target.value || 0)
            )
          }
        />

        {table && (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {t('getData')}
          </Button>
        )}
      </div>

      {tableData && (
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell
                    key={`table-field-${field.name}`}
                    className={classes.tableCell}
                  >
                    {field.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(tableData?.rows || []).map((row, index) => (
                <TableRow key={`table-row-${index}`}>
                  {fields.map((field) => (
                    <TableCell
                      key={`table-row-${index}-${field.name}`}
                      className={classes.tableCell}
                    >
                      {typeof row[field.name] === 'object'
                        ? JSON.stringify(row[field.name])
                        : row[field.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {tableData?.rows < 1 && (
                <TableRow>
                  <TableCell colSpan={fields.length}>
                    {t('emptyTable')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {tableData.more && (
            <Box display="flex" justifyContent="center" p={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(tableData.next_key)}
              >
                {t('loadMore')}
              </Button>
            </Box>
          )}
        </TableContainer>
      )}
    </Box>
  )
}

ContractTables.propTypes = {
  accountName: PropTypes.string,
  abi: PropTypes.any,
  tableData: PropTypes.any,
  onGetTableRows: PropTypes.func
}

ContractTables.defaultProps = {}

export default ContractTables
