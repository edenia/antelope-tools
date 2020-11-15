/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Identicon from 'react-identicons'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import VpnKey from '@material-ui/icons/VpnKey'

import RicardianContract from './RicardianContract'
import ContractActions from './ContractActions'
import ContractTables from './ContractTables'
import ResourceUsage from './ResourceUsage'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 10,
    padding: theme.spacing(2),
    width: '100%',
    height: 'auto',
    '&:focus': {
      outline: 'none'
    }
  },
  accordion: {
    boxShadow: 'none',
    width: '100%',
    borderRadius: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  accordionSummary: {
    padding: 0
  },
  keyItem: {
    display: 'flex'
  },
  keyIcon: {
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.54)'
  },
  keyLabel: {
    wordBreak: 'break-all'
  }
}))

const AccountInfo = ({
  account,
  abi,
  hash,
  onSubmitAction,
  tableData,
  onGetTableRows
}) => {
  const classes = useStyles()
  const [info, setInfo] = useState(null)
  const { t } = useTranslation('accountInfo')

  const getBytesLabel = (bytes) => {
    if (bytes === 0) {
      return `0 kb`
    }

    if (bytes === -1) {
      return `∞ kb`
    }

    return `${(bytes / 1024).toFixed(2)} kb`
  }

  const getMicrosecondsLabel = (microseconds) => {
    if (microseconds === -1) {
      return `∞ µs`
    }

    return `${microseconds} µs`
  }

  useEffect(() => {
    const {
      ram_usage: ramUsage,
      ram_quota: ramQuota,
      cpu_limit: cpuLimit,
      net_limit: netLimit,
      permissions
    } = account

    const ram = {
      percent: ramUsage / ramQuota || 0,
      label: `${getBytesLabel(ramUsage)} / ${getBytesLabel(ramQuota)}`
    }
    const cpu = {
      percent: cpuLimit.used / cpuLimit.max || 0,
      label: `${getMicrosecondsLabel(cpuLimit.used)} / ${getMicrosecondsLabel(
        cpuLimit.max
      )}`
    }
    const net = {
      percent: netLimit.used / netLimit.max || 0,
      label: `${getBytesLabel(netLimit.used)} / ${getBytesLabel(netLimit.max)}`
    }
    const keys = permissions.map((item) => ({
      label: item.perm_name,
      value: item.required_auth?.keys[0]?.key || '-'
    }))

    setInfo({ ...account, ram, cpu, net, keys })
  }, [account])

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      className={classes.paper}
    >
      {info && (
        <>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={2}>
              <Grid item>
                <Identicon
                  string={info.account_name || 'default'}
                  size={60}
                  fg="#757575"
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="h4"
                  color="primary"
                  className={classes.accountName}
                >
                  {info.account_name || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Accordion classes={{ root: classes.accordion }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                classes={{
                  root: classes.accordionSummary
                }}
              >
                <Typography variant="h6" color="primary">
                  {t('resources')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <dl>
                  <dt>
                    <Typography>RAM:</Typography>
                  </dt>
                  <dd>
                    <ResourceUsage
                      percent={info.ram.percent}
                      label={info.ram.label}
                    />
                  </dd>
                  <dt>
                    <Typography>CPU:</Typography>
                  </dt>
                  <dd>
                    <ResourceUsage
                      percent={info.cpu.percent}
                      label={info.cpu.label}
                    />
                  </dd>
                  <dt>
                    <Typography>NET:</Typography>
                  </dt>
                  <dd>
                    <ResourceUsage
                      percent={info.net.percent}
                      label={info.net.label}
                    />
                  </dd>
                </dl>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion classes={{ root: classes.accordion }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                classes={{
                  root: classes.accordionSummary
                }}
              >
                <Typography variant="h6" color="primary">
                  {t('keys')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <dl>
                  {info.keys.map((key) => (
                    <span key={`account-key-${key.label}`}>
                      <dt className={classes.keyItem}>
                        <VpnKey className={classes.keyIcon} />
                        <Typography>{key.label}</Typography>
                      </dt>
                      <dd>
                        <Typography className={classes.keyLabel}>
                          {key.value}
                        </Typography>
                      </dd>
                    </span>
                  ))}
                </dl>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {abi && (
            <>
              <Grid item xs={12}>
                <Accordion classes={{ root: classes.accordion }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{
                      root: classes.accordionSummary
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {t('contractActions')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ContractActions
                      accountName={account.account_name}
                      abi={abi}
                      onSubmitAction={onSubmitAction}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <Accordion classes={{ root: classes.accordion }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{
                      root: classes.accordionSummary
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {t('contractTables')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ContractTables
                      accountName={account.account_name}
                      abi={abi}
                      tableData={tableData}
                      onGetTableRows={onGetTableRows}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <Accordion classes={{ root: classes.accordion }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{
                      root: classes.accordionSummary
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {t('ricardianContract')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RicardianContract abi={abi} hash={hash} />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  )
}

AccountInfo.propTypes = {
  account: PropTypes.any,
  abi: PropTypes.any,
  hash: PropTypes.string,
  onSubmitAction: PropTypes.func,
  tableData: PropTypes.any,
  onGetTableRows: PropTypes.func
}

AccountInfo.defaultProps = {}

export default AccountInfo
