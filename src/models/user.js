import jwtDecode from 'jwt-decode'
import { createSelector } from 'reselect'

import authAPI from '../api/auth.api'

const getUser = (token) => {
  if (!token) return {}

  const tokenData = jwtDecode(token)

  return {
    ...tokenData,
    token
  }
}

export default {
  state: {
    ...getUser(localStorage.getItem('token'))
  },
  reducers: {
    successLogin(state, token) {
      return {
        ...state,
        ...getUser(token)
      }
    }
  },
  effects: (dispatch) => ({
    async login(payload) {
      try {
        const token = await authAPI.login(payload.email, payload.password)
        localStorage.setItem('token', token)
        dispatch.user.successLogin(token)
      } catch (error) {
        dispatch.snackbar.open({
          message: error.message,
          severity: 'error',
          onClose: dispatch.snackbar.close
        })
      }
    },
    async logout() {
      localStorage.removeItem('token')
      dispatch({ type: 'RESET_APP' })
    }
  })
}

export const isAuthenticatedSelector = createSelector(
  (state) => state.user,
  (user) => !!user.email
)
export const tokenSelector = createSelector(
  (state) => state.user,
  (user) => user.token
)
