/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import 'flag-icon-css/css/flag-icon.min.css'

import { eosConfig } from '../config'
import Tooltip from './Tooltip'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  colorWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  colorItem: {
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  [eosConfig.nodeTypes[0].name]: {
    backgroundColor: eosConfig.nodeTypes[0].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  [eosConfig.nodeTypes[1].name]: {
    backgroundColor: eosConfig.nodeTypes[1].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  [eosConfig.nodeTypes[2].name]: {
    backgroundColor: eosConfig.nodeTypes[2].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  [eosConfig.nodeTypes[3].name]: {
    backgroundColor: eosConfig.nodeTypes[3].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  logo: {
    marginRight: theme.spacing(1),
    display: 'inline-block',
    borderRadius: '500rem'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  centerVertically: {
    display: 'flex',
    alignItems: 'center'
  },
  bold: {
    fontWeight: 'bold',
    paddingRight: 4
  }
}))

const NodeSearch = ({ filters: parentFilters, onChange }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeSearchComponent')
  const [nodeType, setNodeType] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [filters, setFilters] = useState({})

  const handleOnChange = (key) => (event) => {
    if (key === 'owner') {
      setFilters({ ...filters, [key]: event.target.value })
      return
    }

    onChange({ ...filters, [key]: event.target.value })
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

  const handlePopoverOpen = (node) => (event) => {
    setNodeType(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    setFilters(parentFilters || {})
  }, [parentFilters])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <FormControl className={classes.formControl}>
              <InputLabel id="nodeTypeFilterLabel">{t('nodeType')}</InputLabel>
              <Select
                classes={{
                  root: classes.capitalize
                }}
                labelId="nodeTypeFilterLabel"
                id="nodeTypeFilter"
                value={filters.nodeType || ''}
                onChange={handleOnChange('nodeType')}
              >
                <MenuItem value="all">{t('all')}</MenuItem>
                {eosConfig.nodeTypes.map((nodeType) => (
                  <MenuItem
                    key={`menu-item-${nodeType.name}`}
                    className={classes.centerVertically}
                    value={nodeType.name}
                  >
                    <span className={classes[nodeType.name]} />
                    <span className={classes.capitalize}>{nodeType.name}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent className={classes.colorWrapper}>
            {eosConfig.nodeTypes.map((nodeType) => (
              <Typography
                key={`node-type=${nodeType.name}`}
                component="p"
                variant="subtitle1"
                className={classes.colorItem}
                onClick={handlePopoverOpen(nodeType)}
              >
                <span className={classes[nodeType.name]} />
                <span className={classes.capitalize}>{nodeType.name}</span>
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <Typography>
          <span className={classes.bold}>{t('nodeType')}:</span>
          <span className={classes.capitalize}>{nodeType?.name}</span>
        </Typography>
        <Typography>
          <span className={classes.bold}>{t('description')}:</span>
          <span>{nodeType?.description}</span>
        </Typography>
        <Typography className={classes.centerVertically}>
          <span className={classes.bold}>{t('color')}:</span>
          <span className={classes[nodeType?.name]} />
        </Typography>
      </Tooltip>
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
