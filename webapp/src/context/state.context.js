import React, { useEffect } from 'react'

import useLightUAL from '../hooks/useUAL'
import { ualConfig } from '../config'

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

  return [
    state,
    {
      update,
      login,
      logout,
      handleOpenMenu,
      handleCloseMenu,
    },
  ]
}
