import React, { useEffect, useCallback } from 'react'

import useLightUAL from '../hooks/useUAL'
import { ualConfig } from '../config'
import eosApi from '../utils/eosapi'

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

  const [state, dispatch] = context
  let infoInterval
  let scheduleInterval

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

  const getBlock = useCallback( async (block) => {
    try {
      const data = await eosApi.getBlock(block)
      let tpb = state.tpb

      if (state.tpb.length >= 60) {
        tpb.pop()
      }

      tpb = [
        {
          blocks: [block],
          transactions: data.transactions.length,
        },
        ...tpb,
      ]

      if (!state.tpsWaitingBlock) {
        dispatch({
          type: 'updateTransactionsStats',
          payload: {
            tpb,
            tpsWaitingBlock: {
              block,
              transactions: data.transactions.length,
            },
          },
        })

        return
      }

      let tps = state.tps

      if (state.tps.length >= 30) {
        tps.pop()
      }

      tps = [
        {
          blocks: [state.tpsWaitingBlock.block, block],
          transactions:
            state.tpsWaitingBlock.transactions + data.transactions.length,
        },
        ...tps,
      ]

      dispatch({
        type: 'updateTransactionsStats',
        payload: {
          tps,
          tpb,
          tpsWaitingBlock: null,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }, [dispatch, state.tpb, state.tps, state.tpsWaitingBlock])

  useEffect(() => {
    let block = state.info.head_block_num

    if (!block) return

    const updateTransactions = async () => {
      await getBlock(block)
    }

    updateTransactions()
  }, [state.info, getBlock])

  const startTrackingProducerSchedule = async ({ interval = 120 } = {}) => {
    if (scheduleInterval) {
      return
    }

    const handle = async () => {
      try {
        const result = await eosApi.getProducerSchedule(true)

        dispatch({ type: 'updateSchedule', payload: result.active })
      } catch (error) {
        console.error(error)
      }
    }

    await handle()
    scheduleInterval = setInterval(handle, interval * 1000)
  }

  const startTrackingInfo = async ({ interval = 1 } = {}) => {
    if (infoInterval) return

    const handle = async () => {
      try {
        const info = await eosApi.getInfo({})

        dispatch({
          type: 'updateInfo',
          payload: info,
        })
      } catch (error) {
        console.error(error)
      }
    }

    if (interval === 0) {
      await handle()
      return
    }

    await handle()
    infoInterval = setInterval(handle, interval * 1000)
  }

  const stopTrackingInfo = async () => {
    if (!infoInterval) return

    clearInterval(infoInterval)
    infoInterval = null
  }

  const stopTrackingProducerSchedule = () => {
    if (!scheduleInterval) return

    clearInterval(scheduleInterval)
    scheduleInterval = null
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
    },
  ]
}
