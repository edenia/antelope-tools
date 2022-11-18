import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import eosApi from '../../utils/eosapi'
import { useSharedState } from '../../context/state.context'
import { NODE_TYPE_LABEL } from '../../utils/lacchain'

const useLacchainNodeConfigState = () => {
  const { t } = useTranslation('lacchainNodeConfig')
  const [{ ual }] = useSharedState()
  const [nodes, setNodes] = useState([])
  const [entityNodes, setEntityNodes] = useState([])
  const [nodeType, setNodeType] = useState()
  const [node, setNode] = useState()
  const [fileDownloadUrl, setFileDownloadUrl] = useState()

  const handleOnChangeNodeType = (event, value) => {
    setNodeType(value)
  }

  const handleOnChangeNode = (event, value) => {
    setNode(value)

    const node = nodes.find((node) => node.name === value)

    if (node?.type !== nodeType) {
      setNodeType(node?.type)
    }
  }

  useEffect(() => {
    const jsonParse = (data) => {
      try {
        return JSON.parse(data)
      } catch (error) {}
    }

    const loadNodes = async () => {
      const { rows: nodes } = await eosApi.getTableRows({
        json: true,
        code: 'eosio',
        scope: 'eosio',
        table: 'node',
      })

      setNodes(
        nodes.map((node) => ({
          ...node,
          info: jsonParse(node.info),
          type: NODE_TYPE_LABEL[node.type],
        })),
      )
    }

    loadNodes()
  }, [])

  useEffect(() => {
    let newNodes = nodes

    if (nodeType) {
      newNodes = newNodes.filter((node) => node.type === nodeType)
    }

    if (ual.activeUser?.accountName) {
      newNodes = newNodes.filter(
        (node) => node.entity === ual.activeUser.accountName,
      )
    }

    if (!ual.activeUser) {
      setNode('')
    }

    setEntityNodes(newNodes)
  }, [nodes, nodeType, ual.activeUser])

  useEffect(() => {
    if (!node && !nodeType) {
      setFileDownloadUrl(null)

      return
    }

    const getTemplate = async (type, node) => {
      const response = await fetch(`/config/${type}.ini`)
      let base = await response.text()
      let peeringNodeTypes = []

      switch (type) {
        case 'validator':
          peeringNodeTypes = ['validator', 'boot']
          break
        case 'writer':
          peeringNodeTypes = ['boot']
          break
        case 'boot':
          peeringNodeTypes = ['validator', 'boot', 'writer', 'observer']
          break
        case 'observer':
          peeringNodeTypes = ['boot']
          break
        default:
          break
      }

      let validNodes = nodes.filter((node) =>
        peeringNodeTypes.includes(node.type),
      )

      if (node) {
        validNodes = validNodes.filter((n) => n.name !== node)
        base = base
          .replace('{your_producer_name}', node)
          .replace('{your_agent_name}', node)
      }

      const peering = []

      for (let index = 0; index < validNodes.length; index++) {
        const node = validNodes[index]
        const name = `# ${node.name} PEERING INFO`
        const p2p = `p2p-peer-address = ${
          node?.info?.[`${node.type}_endpoints`]?.[`${node.type}_p2p`] || ''
        }`
        // eslint-disable-next-line
        const keys = (node.info?.[`${node.type}_keys`]?.peer_keys || [''])
          .map((key) => `peer-key = ${key}`)
          .join('\r\n')
        peering.push(`\r\n${name}\r\n${keys}\r\n${p2p}`)
      }

      const template = `${base}${peering.join('\r\n')}`
      const blob = new Blob([template], {
        type: 'octet/stream',
      })
      setFileDownloadUrl(URL.createObjectURL(blob))
    }

    getTemplate(nodeType, node)
  }, [nodes, nodeType, node])

  return [
    { nodeType, ual, entityNodes, node, fileDownloadUrl },
    { handleOnChangeNode, handleOnChangeNodeType, t },
  ]
}

export default useLacchainNodeConfigState
