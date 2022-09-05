import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import styles from './styles'

const useStyles = makeStyles(styles)

const TableData = ({ tableData, fields, handleSubmit }) => {
  const classes = useStyles()
  const { t } = useTranslation('contractTablesComponent')

  if (!tableData) return <></>

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table size="small">
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
              <TableCell colSpan={fields.length}>{t('emptyTable')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {tableData?.more && (
        <div className={classes.loadMore}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(tableData.next_key)}
          >
            {t('loadMore')}
          </Button>
        </div>
      )}
    </TableContainer>
  )
}

TableData.propTypes = {
  tableData: PropTypes.any,
  fields: PropTypes.array,
  handleSubmit: PropTypes.func,
}

TableData.defaultProps = {}

export default TableData
