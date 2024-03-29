import { useNavigate, useLocation } from 'react-router-dom'

import { useSharedState } from '../../context/state.context'

const useAuthBottonState = () => {
  const [state, { login, logout, handleOpenMenu, handleCloseMenu }] =
    useSharedState()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    logout()
    navigate(location.pathname)
  }

  return [{ state }, { handleOpenMenu, handleCloseMenu, handleSignOut, login }]
}

export default useAuthBottonState
