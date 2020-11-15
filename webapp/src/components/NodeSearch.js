/* eslint camelcase: 0 */
import React, { useState } from 'react'
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
import 'flag-icon-css/css/flag-icon.min.css'

import { generalConfig, eosConfig } from '../config'
import { onImgError } from '../utils'
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

const NodeCard = ({ producers, filters, onChange }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeSummary')
  const [nodeType, setNodeType] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOnChange = (key) => (event) => {
    onChange({ ...filters, [key]: event.target.value })
  }

  const handlePopoverOpen = (node) => (event) => {
    setNodeType(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <FormControl className={classes.formControl}>
              <InputLabel id="producerFilterLabel">{t('producer')}</InputLabel>
              <Select
                classes={{
                  root: classes.centerVertically
                }}
                labelId="producerFilterLabel"
                id="producerFilter"
                value={filters.producer || ''}
                onChange={handleOnChange('producer')}
              >
                <MenuItem value="all">{t('all')}</MenuItem>
                {producers.map((producer) => (
                  <MenuItem
                    key={`menu-item-${producer.owner}`}
                    value={producer.owner}
                    className={classes.centerVertically}
                  >
                    <img
                      width="30px"
                      height="30px"
                      className={classes.logo}
                      src={
                        producer?.bp_json?.org?.branding?.logo_256 ||
                        generalConfig.defaultProducerLogo
                      }
                      onError={onImgError(generalConfig.defaultProducerLogo)}
                      alt="logo"
                    />
                    {producer.bp_json?.org?.candidate_name ||
                      producer.bp_json?.org?.organization_name ||
                      producer.owner}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

NodeCard.propTypes = {
  producers: PropTypes.array,
  filters: PropTypes.any,
  onChange: PropTypes.func
}

NodeCard.defaultProps = {
  producers: [],
  filters: {},
  onChange: () => {}
}

export default NodeCard
