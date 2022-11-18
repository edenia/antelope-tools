import { useNavigate } from 'react-router-dom'

import { useSharedState } from '../../context/state.context'

const useAuthBottonState = () => {
  const [state, { login, logout, handleOpenMenu, handleCloseMenu }] =
    useSharedState()
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return [{ state }, { handleOpenMenu, handleCloseMenu, handleSignOut, login }]
}

export default useAuthBottonState
