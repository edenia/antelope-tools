import { eosConfig } from '../config'

const getNodesStructuredData = producer => {
  if (!producer.bp_json?.nodes?.length) return []

  const structuredData = { nodes: [], inserted: [] }
  const nodesTypes = [
    {
      type: 'seed',
      endpoint: 'p2p_endpoint',
      name: `${eosConfig.networkLabel} P2P Endpoint`,
      description: 'P2P connectivity endpoints',
    },
    {
      type: 'query',
      endpoint: 'ssl_endpoint',
      name: `${eosConfig.networkLabel} API Endpoint`,
      description: 'HTTPS API access point',
    },
  ]

  for (const node of producer.bp_json?.nodes) {
    if (structuredData.inserted.includes(node.node_type)) continue

    const nodeType = nodesTypes.find(
      item => item.type === node.node_type && node[item.endpoint],
    )

    if (nodeType) {
      structuredData.inserted.push(node.node_type)
      structuredData.nodes.push({
        '@type': 'webAPI',
        name: nodeType.name,
        description: nodeType.description,
        url: node[nodeType.endpoint],
        provider: {
          '@type': 'Organization',
          name: producer?.media?.name,
        },
      })
    }

    if (structuredData.inserted.length >= nodesTypes.length) {
      break
    }
  }

  return structuredData.nodes
}

export const getBPStructuredData = producer => {
  const sameAs = producer.social?.map(socialMedia => socialMedia.url)
  const hasValidLocation = Object.keys(producer.location || {}).every(
    (key) => !!producer.location[key],
  )

  if (producer.info?.codeOfConduct) {
    sameAs.push(producer.info?.codeOfConduct)
  }

  if (producer.info?.ownership) {
    sameAs.push(producer.info?.ownership)
  }

  const owns = getNodesStructuredData(producer)

  return {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: producer?.media?.name,
    url: producer?.media?.website,
    ...(producer?.media?.logo && { logo: producer.media?.logo }),
    ...(producer.media?.email && {
      contactPoint: {
        '@type': 'ContactPoint',
        email: producer?.media?.email,
        contactType: 'customer service',
      },
    }),
    ...(hasValidLocation && {
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: producer.location.name,
          addressCountry: producer.location.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: producer.location.latitude,
          longitude: producer.location.longitude,
        },
      },
    }),
    ...(sameAs.length && { sameAs }),
    ...(owns.length && { owns }),
  }
}

export default getBPStructuredData
