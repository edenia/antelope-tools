
import React, {useCallback } from 'react'
import PropTypes from 'prop-types'

const SnackbarMessageContext = React.createContext()

const initialValue = {
  open: false
}

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'showMessage':
      return {
        ...state,
        ...action.payload,
        open: true
      }

    case 'hideMessage':
      return {
        open: false
      }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

export const SnackbarMessageProvider = ({ children, ...props }) => {
  const [state, dispatch] = React.useReducer(stateReducer, {
    ...initialValue
  })
  const value = React.useMemo(() => [state, dispatch], [state])

  return (
    <SnackbarMessageContext.Provider value={value} {...props}>
      {children}
    </SnackbarMessageContext.Provider>
  )
}

SnackbarMessageProvider.propTypes = {
  children: PropTypes.node
}

export const useSnackbarMessageState = () => {
  const context = React.useContext(SnackbarMessageContext)

  if (!context) {
    throw new Error(
      `useSharedState must be used within a SnackbarMessageContext`
    )
  }

  const [state, dispatch] = context
  const showMessage = useCallback(( payload ) => dispatch({ type: 'showMessage', payload }),[dispatch])
  const hideMessage = () => dispatch({ type: 'hideMessage' })

  return [
    state,
    {
      showMessage,
      hideMessage
    }
  ]
}
