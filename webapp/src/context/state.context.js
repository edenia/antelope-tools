import React from 'react'

const SharedStateContext = React.createContext()

const sharedStateReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        ...action.payload
      }
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

const initialValue = {
  lacchain: {
    nodes: [],
    entities: [],
    currentEntity: null,
    dynamicTitle: ''
  }
}

export const SharedStateProvider = ({ ...props }) => {
  const [state, dispatch] = React.useReducer(sharedStateReducer, initialValue)
  const value = React.useMemo(() => [state, dispatch], [state])

  return <SharedStateContext.Provider value={value} {...props} />
}

export const useSharedState = () => {
  const context = React.useContext(SharedStateContext)

  if (!context) {
    throw new Error(`useSharedState must be used within a SharedStateContext`)
  }

  const [state, dispatch] = context
  const update = (payload) => dispatch({ type: 'update', payload })

  return [
    state,
    {
      update
    }
  ]
}
