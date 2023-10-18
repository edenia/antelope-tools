/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Identicon from 'react-identicons'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

import RicardianContract from '../RicardianContract'
import ContractActions from '../ContractActions'
import ContractTables from '../ContractTables'
import MoreInfoModal from '../MoreInfoModal'
import ResourceUsage from '../ResourceUsage'

import styles from './styles'

const useStyles = makeStyles(styles)

const AccordionWrapper = ({ children, title, ...props }) => {
  const classes = useStyles()

  return (
    <Accordion classes={{ root: classes.accordion }} {...props}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: classes.accordionSummary,
        }}
      >
        <Typography component="h4" variant="h6" color="primary">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}

AccordionWrapper.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
}

AccordionWrapper.defaultProps = {}

const AccountInfo = ({
  account,
  abi,
  hash,
  onSubmitAction,
  tableData,
  tableName,
  onGetTableRows,
}) => {
  const classes = useStyles()
  const theme = useTheme()
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
      permissions,
    } = account

    const ram = {
      percent: ramUsage / ramQuota || 0,
      label: `${getBytesLabel(ramUsage)} / ${getBytesLabel(ramQuota)}`,
    }
    const cpu = {
      percent: cpuLimit.used / cpuLimit.max || 0,
      label: `${getMicrosecondsLabel(cpuLimit.used)} / ${getMicrosecondsLabel(
        cpuLimit.max,
      )}`,
    }
    const net = {
      percent: netLimit.used / netLimit.max || 0,
      label: `${getBytesLabel(netLimit.used)} / ${getBytesLabel(netLimit.max)}`,
    }
    const keys = permissions.map((item) => ({
      label: item.perm_name,
      value: item.required_auth?.keys[0]?.key,
    }))

    setInfo({ ...account, ram, cpu, net, keys })
  }, [account])

  return (
    <div className={classes.paper}>
      {!!info && (
        <>
          <div className={classes.boxHeaderCard}>
            <div className={`identicon ${classes.cardPadding}`}>
              <div className={classes.iconBorder}>
                <Identicon
                  string={info.account_name || 'default'}
                  size={60}
                  fg={theme.palette.neutral.dark}
                />
              </div>
              <Typography
                component="h2"
                variant="h4"
                color="primary"
                className={classes.accountName}
              >
                {info.account_name || 'N/A'}
              </Typography>
            </div>
            <div className={classes.border}>
              <Typography component="h3" variant="h6" color="primary" className="columTitle">
                {t('resources')}
              </Typography>
              <div className="resourceUsage">
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
              </div>
            </div>
            <div className={classes.border}>
              <Typography component="h3" variant="h6" color="primary" className="columTitle">
                {t('keys')}
              </Typography>
              <div className="keys">
                {info.keys.map(key => (
                  <span key={`account-key-${key.label}`}>
                    <div className={classes.keyItem}>
                      <Typography>{key.label}</Typography>
                      {key.value ? (
                        <MoreInfoModal Icon={KeyOutlinedIcon}>
                          <Typography className={classes.keyLabel}>
                            {key.value}
                          </Typography>
                        </MoreInfoModal>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {abi && (
            <>
              <AccordionWrapper title={t('contractActions')}>
                <ContractActions
                  accountName={account.account_name}
                  abi={abi}
                  onSubmitAction={onSubmitAction}
                />
              </AccordionWrapper>
              <AccordionWrapper title={t('contractTables')} defaultExpanded>
                <ContractTables
                  accountName={account.account_name}
                  abi={abi}
                  tableData={tableData}
                  tableName={tableName}
                  onGetTableRows={onGetTableRows}
                />
              </AccordionWrapper>
              <AccordionWrapper title={t('ricardianContract')}>
                <RicardianContract abi={abi} hash={hash} />
              </AccordionWrapper>
            </>
          )}
        </>
      )}
    </div>
  )
}

AccountInfo.propTypes = {
  account: PropTypes.any,
  abi: PropTypes.any,
  hash: PropTypes.string,
  onSubmitAction: PropTypes.func,
  tableData: PropTypes.any,
  tableName: PropTypes.string,
  onGetTableRows: PropTypes.func,
}

AccountInfo.defaultProps = {}

export default AccountInfo
