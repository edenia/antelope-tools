const axios = require('axios')
const http = require('http')
const https = require('https')

const instance = axios.create({
  timeout: 5000,
  httpAgent: new http.Agent({ timeout: 5000 }),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    timeout: 5000
  })
})

module.exports = {
  instance
}
