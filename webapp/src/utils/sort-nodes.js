const getOrderNode = (node) => {
  return (
    (node.type?.includes('full') ? 0.5 : 0) +
    (node.endpoints?.length || 0) +
    Boolean(node?.node_info[0]?.version?.length) +
    (node.node_info[0]?.features?.list?.length || 0)
  )
}

const sortNodes = (unsortedNodes, key) => {
  let nodes = []
  let producerNode

  unsortedNodes.sort((a, b) => {
    return getOrderNode(a) - getOrderNode(b)
  })

  for (const node in unsortedNodes) {
    const current = unsortedNodes[node]

    if (current?.type[0] === 'producer') {
      if (!producerNode) {
        const features = { keys: { producer_key: key } }

        producerNode = {
          ...current,
          locations: [],
          node_info: [{ features }],
        }
      }

      producerNode.locations.push(current.location)
    } else {
      nodes = JSON.parse(JSON.stringify(unsortedNodes.slice(node)))
      nodes.reverse()

      if (producerNode) nodes.push(producerNode)

      break
    }
  }

  return nodes
}

export default sortNodes
