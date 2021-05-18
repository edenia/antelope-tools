import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import HelpIcon from '@material-ui/icons/Help'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import Popover from '@material-ui/core/Popover'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'

import { signTransaction } from '../../utils/eos'
import eosApi from '../../utils/eosapi'
import ContractActionForm from '../../components/ContractActionForm'
import BreakpointMasonry from '../../components/BreakpointMasonry'
import { useSharedState } from '../../context/state.context'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2)
  },
  header: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  body: {
    padding: theme.spacing(2)
  },
  helpIcon: {
    cursor: 'pointer'
  },
  tooltip: {
    backgroundColor: 'rgba(97, 97, 97, 0.92)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1)
  },
  tooltipText: {
    color: theme.palette.primary.contrastText
  }
}))

const LacchainManagement = ({ ual }) => {
  const classes = useStyles()
  const { t } = useTranslation('lacchainManagement')
  const [abi, setAbi] = useState(null)
  const [tooltip, setTooltip] = useState({})
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(null)
  const [validActions, setValidActions] = useState([])
  const [, { update }] = useSharedState()
  const [, { showMessage, hideMessage }] = useSnackbarMessageState()

  const handleOnSubmitAction = async (action) => {
    if (!ual.activeUser) {
      showMessage({
        type: 'warning',
        conetent: t('loginWarning')
      })

      return
    }

    hideMessage(null)
    setLoading(true)

    try {
      const result = await signTransaction(ual, {
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: 'active'
          }
        ],
        ...action
      })
      showMessage({
        type: 'success',
        content: `Success transaction ${result.transactionId}`
      })
    } catch (error) {
      showMessage({
        type: 'error',
        content: error?.cause?.message || error?.message || t('unknownError')
      })
    }

    setLoading(false)
  }

  const handleOnTooltipOpen = (text) => (event) => {
    setTooltip(
      tooltip.text === text ? {} : { anchorEl: event.currentTarget, text }
    )
  }

  const handleOnTooltipClose = () => {
    setTooltip({})
  }

  const getEntities = async () => {
    const entities = []
    let hasMore = true
    let key

    while (hasMore) {
      const {
        rows,
        more,
        next_key: nextKey
      } = await eosApi.getTableRows({
        code: 'eosio',
        scope: 'eosio',
        table: 'entity',
        json: true,
        lower_bound: key
      })
      key = nextKey
      hasMore = more

      entities.push(...rows)
    }

    return entities
  }

  const getNodes = async () => {
    const nodes = []
    let hasMore = true
    let key

    while (hasMore) {
      const {
        rows,
        more,
        next_key: nextKey
      } = await eosApi.getTableRows({
        code: 'eosio',
        scope: 'eosio',
        table: 'node',
        json: true,
        lower_bound: key
      })
      key = nextKey
      hasMore = more

      nodes.push(...rows)
    }

    return nodes
  }

  useEffect(() => {
    const checkAccount = async () => {
      let actions = []

      if (ual.activeUser.accountName === 'eosio') {
        actions = [
          'setentinfo',
          'addentity',
          'addboot',
          'addobserver',
          'addwriter',
          'addvalidator',
          'setnodeinfo',
          'setschedule',
          'setalimits',
          'netrmgroup',
          'netsetgroup',
          'netaddgroup',
          'setram',
          'setentxinfo',
          'setnodexinfo',
          'rmnode',
          'rmentity'
        ]
      }

      const entities = await getEntities()
      const currentEntity = entities.find(
        (item) => item.name === ual.activeUser.accountName
      )

      if (currentEntity) {
        actions = ['setentinfo', 'setnodeinfo', 'newaccount', 'setram']
      }

      if (currentEntity?.type === 1) {
        actions = [
          ...actions,
          'addboot',
          'addobserver',
          'addwriter',
          'addvalidator',
          'rmnode'
        ]
      }

      if (currentEntity?.type === 2) {
        actions = [...actions, 'addobserver', 'addwriter']
      }

      setValidActions(actions)

      if (!actions.length) {
        showMessage({
          type: 'warning',
          content: t('noneActionWarning')
        })

        return
      }

      const { abi } = await eosApi.getAbi('eosio')
      setAbi(abi)
      const nodes = await getNodes()
      update({
        entities,
        nodes,
        currentEntity,
        isAdmin: ual.activeUser.accountName === 'eosio'
      })
    }

    if (!ual.activeUser) {
      setMessage({
        type: 'warning',
        content: t('loginWarning')
      })
      setValidActions([])

      return
    }

    setMessage(null)
    hideMessage()
    checkAccount()
    // eslint-disable-next-line
  }, [ual.activeUser, t])

  return (
    <Box>
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
          paper: classes.tooltip
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Typography className={classes.tooltipText}>
          {t(tooltip.text)}
        </Typography>
      </Popover>
      <BreakpointMasonry>
        {!!validActions.length &&
          validActions.map((action, index) => (
            <Paper
              className={classes.paper}
              elevation={1}
              key={`action-${index}`}
            >
              <Box className={classes.header}>
                <Typography variant="h4">{t(`${action}Title`)}</Typography>

                <HelpIcon
                  className={classes.helpIcon}
                  onClick={handleOnTooltipOpen(`${action}Tooltip`)}
                />
              </Box>
              <Divider />
              {abi && (
                <Box className={classes.body}>
                  <ContractActionForm
                    accountName="eosio"
                    action={action}
                    abi={abi}
                    onSubmitAction={handleOnSubmitAction}
                  />
                </Box>
              )}
            </Paper>
          ))}
      </BreakpointMasonry>
    </Box>
  )
}

LacchainManagement.propTypes = {
  ual: PropTypes.object
}

export default LacchainManagement
