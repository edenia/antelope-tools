const axios = require('axios')
const http = require('http')
const https = require('https')

const instance = axios.create({
  timeout: 100000,
  httpAgent: new http.Agent({ timeout: 300000 }),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    timeout: 300000
  })
})

module.exports = {
  instance
}
