const axios = require('axios')
const http = require('http')
const https = require('https')

const instance = axios.create({
  timeout: 30000,
  httpAgent: new http.Agent({ timeout: 60000 }),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    timeout: 60000
  })
})

module.exports = {
  instance
}
