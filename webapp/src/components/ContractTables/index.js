import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import styles from './styles'
import TableData from './TableData'

const useStyles = makeStyles(styles)

const ContractTables = ({ accountName, abi, tableData, onGetTableRows }) => {
  const initData = { scope: '', lowerBound: null, upperBound: null, limit: 10 }
  const formFields = [
    { name: 'scope', type: 'text' },
    { name: 'lowerBound', type: 'number' },
    { name: 'upperBound', type: 'number' },
    { name: 'limit', type: 'number' },
  ]

  const { t } = useTranslation('contractTablesComponent')
  const classes = useStyles()
  const [tables, setTables] = useState([])
  const [table, setTable] = useState('')
  const [fields, setFields] = useState([])
  const [filters, setFilters] = useState(initData)

  const getValidValue = (value, type) => {
    switch (type) {
      case 'number':
        return isNaN(value) ? 10 : parseInt(value)
      default:
        return value
    }
  }

  const handleOnChange = (event) => {
    const { name, value, type } = event.target

    setFilters((prev) => ({ ...prev, [name]: getValidValue(value, type) }))
  }

  const handleTableChange = (value) => {
    setTable(value)

    if (!onGetTableRows) return

    onGetTableRows({
      scope: filters.scope,
      limit: filters.limit,
      table: value,
      code: accountName,
      json: true,
    })
  }

  const handleSubmit = (nextKey) => {
    if (!onGetTableRows) return

    onGetTableRows({
      scope: filters.scope,
      limit: filters.limit,
      table,
      code: accountName,
      json: true,
      lower_bound: nextKey || filters.lowerBound,
      upper_bound: filters.upperBound,
      loadMore: !!nextKey,
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
    setFilters((prev) => ({
      ...prev,
      scope: accountName,
    }))
  }, [accountName])

  return (
    <Grid width="100%">
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

        {formFields.map(({ name, type }, index) => (
          <TextField
            key={`field-${name}-${index}`}
            label={t(name)}
            name={name}
            type={type}
            variant="outlined"
            className={classes.formControl}
            value={filters[name] ?? ''}
            onChange={(event) => handleOnChange(event)}
          />
        ))}

        {table && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(null)}
          >
            {t('refreshData')}
          </Button>
        )}
      </div>

      <TableData
        tableData={tableData}
        fields={fields}
        handleSubmit={handleSubmit}
      />
    </Grid>
  )
}

ContractTables.propTypes = {
  accountName: PropTypes.string,
  abi: PropTypes.any,
  tableData: PropTypes.any,
  onGetTableRows: PropTypes.func,
}

ContractTables.defaultProps = {}

export default ContractTables
