import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'

import useDebounceState from '../../hooks/customHooks/useDebounceState'

import styles from './styles'
import TableData from './TableData'

const useStyles = makeStyles(styles)

const ContractTables = ({
  accountName,
  abi,
  tableData,
  onGetTableRows,
  tableName,
}) => {
  const initData = {
    table: '',
    scope: '',
    lowerBound: null,
    upperBound: null,
    limit: 10,
  }
  const formFields = [
    { name: 'scope', type: 'text' },
    { name: 'lowerBound', type: 'number' },
    { name: 'upperBound', type: 'number' },
    { name: 'limit', type: 'number' },
  ]
  const DELAY = 300

  const { t } = useTranslation('contractTablesComponent')
  const classes = useStyles()
  const [tables, setTables] = useState([])
  const [fields, setFields] = useState([])
  const [filters, setFilters] = useState(initData)
  const debouncedFilter = useDebounceState(filters, DELAY)

  const getValidValue = (value, type) => {
    switch (type) {
      case 'number':
        return isNaN(value) || value < 0 ? 0 : parseInt(value)
      default:
        return value
    }
  }

  const handleOnChange = (event) => {
    const { name, value, type } = event.target

    setFilters((prev) => ({ ...prev, [name]: getValidValue(value, type) }))
  }

  const handleTableChange = useCallback(
    (value) => {
      setFilters((prev) => ({ ...prev, table: value }))
    },
    [setFilters],
  )

  const handleSubmit = useCallback(
    (nextKey) => {
      if (!onGetTableRows || !filters.table) return

      onGetTableRows({
        scope: filters.scope,
        limit: filters.limit,
        table: filters.table,
        code: accountName,
        json: true,
        lower_bound: nextKey || filters.lowerBound,
        upper_bound: filters.upperBound,
        loadMore: !!nextKey,
      })
    },
    [accountName, onGetTableRows, filters],
  )

  useEffect(() => {
    if (!abi) {
      setTables([])

      return
    }

    setTables(abi.tables.map((table) => table.name))
  }, [abi])

  useEffect(() => {
    if (!filters.table) {
      setFields([])

      return
    }

    const tableType = abi.tables.find(
      (item) => item.name === filters.table,
    )?.type
    const struct = abi.structs.find((struct) => struct.name === tableType)
    setFields(struct?.fields || [])
  }, [filters.table, abi])

  useEffect(() => {
    if (tableName) {
      handleTableChange(tableName)
    }

    setFilters((prev) => ({
      ...prev,
      scope: accountName,
    }))
  }, [accountName, tableName, handleTableChange])

  useEffect(() => {
    handleSubmit(null)
    // eslint-disable-next-line
  }, [debouncedFilter])

  return (
    <div>
      <div className={classes.form}>
        <FormControl
          variant="outlined"
          className={`${classes.formControl} ${classes.tableEmpty}`}
        >
          <InputLabel id="tableLabel">{t('table')}</InputLabel>
          <Select
            labelId="tableLabel"
            id="table"
            value={filters.table}
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

        {filters.table && (
          <Button
            variant="contained"
            color="primary"
            className={classes.refreshButton}
            onClick={() => handleSubmit()}
          >
            <RefreshIcon />
            {t('refreshData')}
          </Button>
        )}
      </div>

      <TableData
        tableData={tableData}
        fields={fields}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

ContractTables.propTypes = {
  accountName: PropTypes.string,
  abi: PropTypes.any,
  tableData: PropTypes.any,
  tableName: PropTypes.string,
  onGetTableRows: PropTypes.func,
}

ContractTables.defaultProps = {}

export default ContractTables
