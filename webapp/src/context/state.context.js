import React, { useEffect, useCallback, useRef } from 'react'

import useLightUAL from '../hooks/useUAL'
import { ualConfig } from '../config'
import eosApi, { ENDPOINTS_ERROR } from '../utils/eosapi'

const SharedStateContext = React.createContext()

const sharedStateReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        ...action.payload,
      }
    }

    case 'logout':
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')

      return { ...state, user: null }

    case 'ual':
      return {
        ...state,
        ual: action.ual,
      }

    case 'setOpenMenuWallets': {
      return {
        ...state,
        elemRef: action.payload,
        openMenuWallets: Boolean(action.payload),
      }
    }

    case 'updateInfo': {
      return {
        ...state,
        info: action.payload,
      }
    }

    case 'pushTPB': {
      if (state.tpb[0].blocks[0] === action.payload.blocks[0])
        return { ...state }

      const tpb = JSON.parse(JSON.stringify(state.tpb))

      if (tpb.length >= 60) {
        tpb.pop()
      }

      return {
        ...state,
        tpsWaitingBlock: !state.tpsWaitingBlock ? action.payload : null,
        tpb: [action.payload, ...tpb],
      }
    }

    case 'pushTPS': {
      const previousBlock = state.tpb[1]

      if (!state.tpsWaitingBlock || !previousBlock) return { ...state }

      let tps = JSON.parse(JSON.stringify(state.tps))

      if (state.tps.length >= 30) {
        tps.pop()
      }

      return {
        ...state,
        tps: [
          {
            blocks: [previousBlock.blocks[0], action.payload.blocks[0]],
            transactions:
              previousBlock.transactions + action.payload.transactions,
            cpu: (action.payload.cpu + previousBlock.cpu) / 2,
            net: (action.payload.net + previousBlock.net) / 2,
          },
          ...tps,
        ],
      }
    }

    case 'updateTransactionsStats': {
      return {
        ...state,
        ...action.payload,
      }
    }

    case 'updateSchedule': {
      return {
        ...state,
        schedule: action.payload,
      }
    }

    case 'updateTranslationAlertsState': {
      return {
        ...state,
        translationinProgress: {
          ...state.translationinProgress,
          isAlertShown: {
            ...state.translationinProgress.isAlertShown,
            [action.payload]: true
          }
        },
      }
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

const initialValue = {
  openMenuWallets: false,
  elemRef: null,
  lacchain: {
    nodes: [],
    entities: [],
    currentEntity: null,
    dynamicTitle: '',
  },
  schedule: {
    version: '',
    producers: [],
  },
  info: {},
  tps: new Array(30).fill({ blocks: [], transactions: 0 }),
  tpb: new Array(60).fill({ blocks: [], transactions: 0 }),
  tpsWaitingBlock: null,
  translationinProgress: {
    isAlertShown: {}
  }
}

export const SharedStateProvider = ({ ...props }) => {
  const ualState = useLightUAL({
    appName: ualConfig.appName,
    chains: ualConfig.network,
    authenticators: ualConfig.authenticators,
  })
  const [state, dispatch] = React.useReducer(sharedStateReducer, initialValue)
  const value = React.useMemo(() => [state, dispatch], [state])

  useEffect(() => {
    const load = async () => {
      dispatch({ type: 'ual', ual: ualState })

      if (!ualState?.activeUser) return
    }

    load()

    // eslint-disable-next-line
  }, [ualState?.activeUser])

  return <SharedStateContext.Provider value={value} {...props} />
}

export const useSharedState = () => {
  const context = React.useContext(SharedStateContext)

  if (!context) {
    throw new Error(`useSharedState must be used within a SharedStateContext`)
  }

  const lastBlock = useRef()
  const infoInterval = useRef(null)
  
  const [state, dispatch] = context
  const waitTrackingInterval = 30000
  let scheduleInterval
  let global

  const update = (payload) => dispatch({ type: 'update', payload })
  const login = (type) => {
    state.ual.login(type)
  }
  const logout = () => {
    dispatch({ type: 'logout' })
    state.ual.logout()
  }
  const handleOpenMenu = (event) => {
    dispatch({
      type: 'setOpenMenuWallets',
      payload: event.currentTarget,
    })
  }
  const handleCloseMenu = () => {
    dispatch({
      type: 'setOpenMenuWallets',
      payload: null,
    })
  }

  const getGlobalConfig = async () => {
    if (!global) {
      try {
        const info = await eosApi.getInfo({})

        global = {
          maxBlockCPU: info?.block_cpu_limit,
          maxBlockNET: info?.block_net_limit,
        }
      } catch (error) {}
    }

    return global
  }

  const getUsage = async block => {
    const globalConfig = await getGlobalConfig()

    return block?.transactions?.reduce(
      (total, current) => {
        total.cpu +=
          (current.cpu_usage_us / globalConfig.maxBlockCPU) * 100 || 0
        total.net +=
          (current.net_usage_words / globalConfig.maxBlockNET) * 100 || 0
        return total
      },
      { net: 0, cpu: 0 },
    )
  }

  const getBlock = useCallback(
    async blockNum => {
      try {
        const block = await eosApi.getBlock(blockNum)
        const blockUsage = await getUsage(block)
        const payload = {
          blocks: [blockNum],
          transactions: block.transactions.length,
          ...blockUsage,
        }

        dispatch({
          type: 'pushTPB',
          payload,
        })

        dispatch({
          type: 'pushTPS',
          payload,
        })
      } catch (error) {
        console.error(error?.message || error)
      }
    },
    // eslint-disable-next-line
    [dispatch],
  )

  const startTrackingProducerSchedule = async ({ interval = 120 } = {}) => {
    if (scheduleInterval) return

    const handle = async () => {
      try {
        const result = await eosApi.getProducerSchedule(true)

        dispatch({ type: 'updateSchedule', payload: result.active })
      } catch (error) {
        console.error(error?.message || error)

        if (error?.message === ENDPOINTS_ERROR) {
          stopTrackingProducerSchedule()
          setTimeout(() => {
            startTrackingProducerSchedule({ interval })
          }, waitTrackingInterval)
        }
      }
    }

    await handle()

    if (scheduleInterval) return

    scheduleInterval = setInterval(handle, interval * 1000)
  }

  const startTrackingInfo = async ({ interval = 1 } = {}) => {
    if (infoInterval.current) return

    const handle = async () => {
      try {
        const info = await eosApi.getInfo({})

        dispatch({
          type: 'updateInfo',
          payload: { ...info },
        })

        if (!lastBlock.current) {
          lastBlock.current = info.head_block_num
        } else {
          lastBlock.current += 1
        }

        await getBlock(lastBlock.current)
      } catch (error) {
        console.error(error?.message || error)

        if (error?.message === ENDPOINTS_ERROR) {
          clearInterval(infoInterval.current)
        }
      }
    }

    infoInterval.current = setInterval(handle, interval * 1000)
  }

  const stopTrackingInfo = () => {
    if (!infoInterval.current) return

    clearInterval(infoInterval.current)
    infoInterval.current = null
    lastBlock.current = null
  }

  const stopTrackingProducerSchedule = () => {
    if (!scheduleInterval) return

    clearInterval(scheduleInterval)
    scheduleInterval = null
  }

  const updateTranslationAlertsState = language => {
    dispatch({
      type: 'updateTranslationAlertsState',
      payload: language,
    })
  }

  return [
    state,
    {
      update,
      login,
      logout,
      handleOpenMenu,
      handleCloseMenu,
      stopTrackingProducerSchedule,
      stopTrackingInfo,
      startTrackingInfo,
      startTrackingProducerSchedule,
      updateTranslationAlertsState
    },
  ]
}
