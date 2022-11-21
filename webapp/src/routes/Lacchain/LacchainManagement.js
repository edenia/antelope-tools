import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Popover from '@mui/material/Popover'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LinearProgress from '@mui/material/LinearProgress'

import ContractActionForm from '../../components/ContractActionForm'
import ColumnCreator from '../../components/BreakpointColumns'

import useLacchainManagementState from './useLacchainManagementState'
import useStyles from './LacchainManagmentStyle'

const LacchainManagement = () => {
  const classes = useStyles()
  const [
    { message, loading, tooltip, validActions, abi },
    {
      t,
      setMessage,
      handleOnTooltipClose,
      handleOnSubmitAction,
      handleOnTooltipOpen,
    },
  ] = useLacchainManagementState()

  return (
    <div>
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)}>
          {t(message.content)}
        </Alert>
      )}
      {loading && <LinearProgress className={classes.loader} color="primary" />}
      <Popover
        open={!!tooltip.anchorEl}
        anchorEl={tooltip.anchorEl}
        onClose={handleOnTooltipClose}
        classes={{
          paper: classes.tooltip,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.tooltipText}>
          {t(tooltip.text)}
        </Typography>
      </Popover>
      <ColumnCreator>
        {!!validActions.length &&
          validActions.map((action, index) => (
            <Paper
              className={classes.paper}
              elevation={1}
              key={`action-${index}`}
            >
              <div className={classes.header}>
                <Typography variant="h4" className={classes.titleLabel}>
                  {t(`${action}Title`)}
                </Typography>

                <InfoOutlinedIcon
                  className={classes.helpIcon}
                  onClick={handleOnTooltipOpen(`${action}Tooltip`)}
                />
              </div>
              {abi && (
                <div className={classes.body}>
                  <ContractActionForm
                    accountName="eosio"
                    action={action}
                    abi={abi}
                    onSubmitAction={handleOnSubmitAction}
                  />
                </div>
              )}
            </Paper>
          ))}
      </ColumnCreator>
    </div>
  )
}

export default LacchainManagement
