const axios = require('axios')
const http = require('http')
const https = require('https')

const instance = axios.create({
  timeout: 10000,
  httpAgent: new http.Agent({ timeout: 30000 }),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    timeout: 30000
  })
})

module.exports = {
  instance
}
