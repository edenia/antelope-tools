import { lazy } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))
const Login = lazy(() => import('./Login'))

export default [
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    component: Login
  }
]
