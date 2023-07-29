import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
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
  const keysTypes = [
    'i64',
    'i128',
    'i256',
    'float64',
    'float128',
    'sha256',
    'ripemd160',
    'name',
  ]
  const initData = {
    table: '',
    scope: '',
    index: '',
    keyType: keysTypes[0],
    lowerBound: null,
    upperBound: null,
    limit: 10,
    reverse: false,
  }
  const formFields = [
    { name: 'scope', type: 'text' },
    { name: 'index', type: 'text' },
    { name: 'keyType', type: 'text', component: 'select', options: keysTypes },
    { name: 'lowerBound', type: 'text' },
    { name: 'upperBound', type: 'text' },
    { name: 'limit', type: 'number' },
  ]
  const DELAY = 500

  const { t } = useTranslation('contractTablesComponent')
  const classes = useStyles()
  const [tables, setTables] = useState([])
  const [fields, setFields] = useState([])
  const [filters, setFilters] = useState(initData)
  const [selectedTable, setSelectedTable] = useState(tableName)
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
      if (!onGetTableRows || !selectedTable) return

      onGetTableRows({
        scope: filters.scope,
        limit: filters.limit,
        table: selectedTable,
        code: accountName,
        json: true,
        key_type: filters.keyType,
        index_position: filters.index,
        reverse: filters.reverse,
        lower_bound: nextKey || filters.lowerBound,
        upper_bound: filters.upperBound,
        loadMore: !!nextKey,
      })
    },
    [accountName, onGetTableRows, filters, selectedTable],
  )

  const handleTableSelect = (_event, value) => {
    setSelectedTable(value || '')
    if (tables.includes(value)) {
      handleTableChange(value)
    }
  }

  const handleFilterSelect = (newValue, name, type) => {
    handleOnChange({
      target: { name, type, value: newValue || '' },
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
    if (!filters.table) {
      setFields([])

      return
    }

    const tableType = abi.tables.find(
      item => item.name === filters.table,
    )?.type
    const struct = abi.structs.find(struct => struct.name === tableType)

    setSelectedTable(tableType ? filters.table : '')
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
    <>
      <div className={classes.form}>
        <div className={classes.fieldsContainer}>
          <Autocomplete
            className={classes.textField}
            options={tables}
            value={selectedTable}
            inputValue={selectedTable}
            onChange={handleTableSelect}
            onInputChange={handleTableSelect}
            renderInput={params => (
              <TextField {...params} label={t('table')} />
            )}
            noOptionsText={t('noOptions')}
          />

          {formFields.map(({ name, type, component, options }, index) =>
            component === 'select' ? (
              <Autocomplete
                className={classes.textField}
                key={`field-${name}-${index}`}
                options={options}
                value={filters[name] ?? ''}
                inputValue={filters[name] ?? ''}
                onChange={(_e, value) => {
                  handleFilterSelect(value, name, type)
                }}
                onInputChange={(_e, value) => {
                  handleFilterSelect(value, name, type)
                }}
                renderInput={params => (
                  <TextField {...params} label={t(name)} />
                )}
                noOptionsText={t('noOptions')}
              />
            ) : (
              <TextField
                className={classes.textField}
                key={`field-${name}-${index}`}
                label={t(name)}
                name={name}
                type={type}
                variant="outlined"
                value={filters[name] ?? ''}
                onChange={event => handleOnChange(event)}
              />
            ),
          )}

          <FormControlLabel
            className={classes.checkBox}
            control={
              <Checkbox
                checked={filters.reverse}
                onChange={event => {
                  setFilters(prev => ({
                    ...prev,
                    reverse: event.target.checked,
                  }))
                }}
              />
            }
            label={t('reverse')}
            labelPlacement="top"
          />
        </div>

        <div>
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
      </div>

      <TableData
        tableData={tableData}
        fields={fields}
        handleSubmit={handleSubmit}
      />
    </>
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
