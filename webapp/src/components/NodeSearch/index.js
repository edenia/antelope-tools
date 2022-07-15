/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import 'flag-icon-css/css/flag-icon.min.css'

import { eosConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles((theme) => styles(theme, eosConfig))

const NodeSearch = ({ filters: parentFilters, onChange }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeSearchComponent')
  const [nodeSelected, setNodeSelected] = useState('all')
  const [filters, setFilters] = useState({})

  const handleOnChange = (key) => (event) => {
    setFilters({ ...filters, [key]: event.target.value })
  }

  const handleOnClickChip = (nodeName) => {
    setNodeSelected(nodeName)
    onChange({ ...filters, nodeType: nodeName })
  }

  const handleOnClick = () => {
    onChange(filters)
  }

  const handleOnKeyDown = (event) => {
    if (event.keyCode !== 13) {
      return
    }

    onChange(filters)
  }

  useEffect(() => {
    setFilters(parentFilters || {})
  }, [parentFilters])

  return (
    <Grid container spacing={2} className={classes.nodeSearchWrapper}>
      <Grid item xs={12}>
        <Card>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title}>{`${t(
              'title'
            )}:`}</Typography>
            <TextField
              label={t('producer')}
              variant="outlined"
              className={classes.formControl}
              value={filters.owner || ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleOnClick}
                      edge="end"
                      aria-label="search"
                    >
                      <SearchOutlinedIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onKeyDown={handleOnKeyDown}
              onChange={handleOnChange('owner')}
            />
            <Box className={classes.chipWrapper}>
              <Chip
                label="All Nodes"
                clickable
                onClick={() => handleOnClickChip('all')}
                className={clsx({ [classes.selected]: nodeSelected === 'all' })}
              />

              {eosConfig.nodeTypes.map((nodeType, index) => (
                <Chip
                  clickable
                  key={`chip-${nodeType.name}-${index}`}
                  label={nodeType.name}
                  onClick={() => handleOnClickChip(nodeType.name)}
                  className={clsx({
                    [classes.selected]: nodeSelected === nodeType.name
                  })}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

NodeSearch.propTypes = {
  filters: PropTypes.any,
  onChange: PropTypes.func
}

NodeSearch.defaultProps = {
  onChange: () => {}
}

export default memo(NodeSearch)
