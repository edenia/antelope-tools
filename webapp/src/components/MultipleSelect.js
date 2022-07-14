import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1)
  },
  chip: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  selectChips: {
    paddingBottom: 0
  }
}))

const MultipleSelect = ({
  value,
  onChange,
  label,
  variant,
  className,
  options
}) => {
  const classes = useStyles()
  const handleOnFieldChange = (event) => {
    onChange(event?.target?.value)
  }
  const renderValue = (selected) => (
    <div className={classes.chips}>
      {selected.map((value, index) => (
        <Chip
          key={`chip-item-${index}`}
          label={value}
          className={classes.chip}
        />
      ))}
    </div>
  )

  return (
    <TextField
      onChange={handleOnFieldChange}
      variant={variant}
      label={label}
      select
      SelectProps={{
        multiple: true,
        classes: {
          root: value.length ? classes.selectChips : ''
        },
        renderValue
      }}
      value={value || []}
      className={className}
    >
      {options.map((option, index) => (
        <MenuItem key={`menu-item-${index}`} value={option.value}>
          <Checkbox checked={(value || []).indexOf(option.value) > -1} />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </TextField>
  )
}

MultipleSelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array
}

export default MultipleSelect
