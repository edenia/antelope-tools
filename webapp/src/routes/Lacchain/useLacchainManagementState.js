import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { signTransaction } from '../../utils/eos'
import eosApi from '../../utils/eosapi'
import { useSharedState } from '../../context/state.context'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'

const useLacchainManagementState = () => {
  const { t } = useTranslation('lacchainManagement')
  const [abi, setAbi] = useState(null)
  const [tooltip, setTooltip] = useState({})
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(null)
  const [validActions, setValidActions] = useState([])
  const [{ ual }, { update }] = useSharedState()
  const [, { showMessage, hideMessage }] = useSnackbarMessageState()

  const handleOnSubmitAction = async (action) => {
    if (!ual.activeUser) {
      showMessage({
        type: 'warning',
        conetent: t('loginWarning'),
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
            permission: 'active',
          },
        ],
        ...action,
      })
      showMessage({
        type: 'success',
        content: `Success transaction ${result.transactionId}`,
      })
    } catch (error) {
      showMessage({
        type: 'error',
        content: error?.cause?.message || error?.message || t('unknownError'),
      })
    }

    setLoading(false)
  }

  const handleOnTooltipOpen = (text) => (event) => {
    setTooltip(
      tooltip.text === text ? {} : { anchorEl: event.currentTarget, text },
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
        next_key: nextKey,
      } = await eosApi.getTableRows({
        code: 'eosio',
        scope: 'eosio',
        table: 'entity',
        json: true,
        lower_bound: key,
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
        next_key: nextKey,
      } = await eosApi.getTableRows({
        code: 'eosio',
        scope: 'eosio',
        table: 'node',
        json: true,
        lower_bound: key,
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
      let dynamicTitle = ''

      if (ual.activeUser.accountName === 'eosio') {
        dynamicTitle = t('comiteeAccount')
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
          'rmentity',
        ]
      }

      const entities = await getEntities()
      const currentEntity = entities.find(
        (item) => item.name === ual.activeUser.accountName,
      )

      if (currentEntity) {
        actions = ['setentinfo', 'setnodeinfo', 'newaccount', 'setram']
      }

      if (currentEntity?.type === 1) {
        dynamicTitle = t('partnerAccount')
        actions = [
          ...actions,
          'addboot',
          'addobserver',
          'addwriter',
          'addvalidator',
          'rmnode',
        ]
      }

      if (currentEntity?.type === 2) {
        dynamicTitle = t('nonPartnerAccount')
        actions = [...actions, 'addobserver', 'addwriter']
      }

      setValidActions(actions)

      if (!actions.length) {
        showMessage({
          type: 'warning',
          content: t('noneActionWarning'),
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
        isAdmin: ual.activeUser.accountName === 'eosio',
        dynamicTitle,
      })
    }

    if (!ual.activeUser) {
      setMessage({
        type: 'warning',
        content: t('loginWarning'),
      })
      setValidActions([])

      return
    }

    setMessage(null)
    hideMessage()
    checkAccount()
    // eslint-disable-next-line
  }, [ual.activeUser, t])

  return [
    { message, loading, tooltip, validActions, abi },
    {
      t,
      setMessage,
      handleOnTooltipClose,
      handleOnSubmitAction,
      handleOnTooltipOpen,
    },
  ]
}

export default useLacchainManagementState
