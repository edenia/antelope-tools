/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Identicon from 'react-identicons'
import Accordion from '@mui/material/Accordion'
import Box from '@mui/material/Box'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import RicardianContract from '../RicardianContract'
import ContractActions from '../ContractActions'
import ContractTables from '../ContractTables'
import ResourceUsage from '../ResourceUsage'

import styles from './styles'

const useStyles = makeStyles(styles)

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
  const { t } = useTranslation('accountInfoComponent')

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
          <Box className={classes.boxHeaderCard}>
            <Box className="identicon">
              <Box className={classes.iconBorder}>
                <Identicon
                  string={info.account_name || 'default'}
                  size={60}
                  fg="#757575"
                />
              </Box>
              <Typography
                variant="h4"
                color="primary"
                className={classes.accountName}
              >
                {info.account_name || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary" className="columTitle">
                {t('resources')}
              </Typography>
              <Box className="resourceUsage">
                <ResourceUsage
                  title="RAM"
                  percent={info.ram.percent}
                  label={info.ram.label}
                />
                <ResourceUsage
                  title="CPU"
                  percent={info.cpu.percent}
                  label={info.cpu.label}
                />
                <ResourceUsage
                  title="NET"
                  percent={info.net.percent}
                  label={info.net.label}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" color="primary" className="columTitle">
                {t('keys')}
              </Typography>
              <Box className="keys">
                <dl>
                  {info.keys.map((key) => (
                    <span key={`account-key-${key.label}`}>
                      <dt className={classes.keyItem}>
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
              </Box>
            </Box>
          </Box>

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
