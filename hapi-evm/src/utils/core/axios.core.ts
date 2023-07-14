import axios from 'axios'
import https from 'https'

const instance = axios.create({
  timeout: 15000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

export default instance
