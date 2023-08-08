import axios from 'axios'

import { evmConfig } from '../config'

const queryEthApi = async method => {
  try {
    const {
      data: { result },
    } = await axios.post(evmConfig.endpoint, {
      method,
      params: [],
      id: 1,
      jsonrpc: '2.0',
    })

    return parseInt(result) || result
  } catch (error) {}
}

const getGasPrice = async () => await queryEthApi('eth_gasPrice')
const getLastBlock = async () => await queryEthApi('eth_blockNumber')
const getChainId = async () => await queryEthApi('eth_chainId')

export default {
  getGasPrice,
  getLastBlock,
  getChainId,
}
