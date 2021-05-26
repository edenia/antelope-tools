/* eslint complexity: 0 */
/* eslint camelcase: 0 */
import moment from 'moment'

import { eosConfig } from '../config'

export const formatData = (
  {
    data,
    rank,
    owner,
    updatedAt,
    missedBlocks,
    nodes,
    healthStatus,
    endpoints,
    dataType,
    node
  },
  type,
  t
) => {
  let newData = {
    title: '',
    media: {},
    info: {},
    stats: {},
    nodes: [],
    healthStatus: [],
    social: {},
    endpoints: {}
  }

  const getSubTitle = () => {
    if (eosConfig.networkName === 'lacchain')
      return `${t(`entityType${dataType}`)} Entity`

    if (rank <= 21) return 'Top 21'

    if (rank > 21 && rank <= 64) return 'Paid Standby'

    return 'Non-Paid Standby'
  }

  switch (type) {
    case 'entity':
      if (eosConfig.networkName === 'lacchain') {
        newData.title = owner
      } else {
        newData.title = rank ? `#${rank} - ${owner}` : owner
      }

      newData = {
        ...newData,
        media: {
          logo: data.branding?.logo_256 || null,
          name: data.candidate_name || data.organization_name || owner,
          account: getSubTitle()
        },
        info: {
          location: data.location?.name || 'N/A',
          country: data.location?.country || null,
          website: data?.website || '',
          email: data.email,
          ownership: data?.chain_resources || null,
          bussinesContact: data.bussines_contact || null,
          technicalContact: data.technical_contact || null,
          chain: data?.chain_resources || null
        },
        stats: {
          votes: 'N/A',
          rewards: 0,
          lastChecked: moment(new Date()).diff(moment(updatedAt), 'seconds'),
          missedBlocks: missedBlocks.reduce(
            (result, current) => result + current.value,
            0
          )
        },
        nodes,
        healthStatus,
        social: data.social
      }

      break

    case 'node':
      newData = {
        title: owner || null,
        media: {
          logo: data.branding?.logo_256 || null,
          name: node?.name,
          account: node?.node_type || null
        },
        info: {
          version: node?.server_version_string || null,
          features: node?.features || [],
          keys: node?.keys || null
        },
        stats: {
          lastChecked: moment(new Date()).diff(moment(updatedAt), 'seconds'),
          missedBlocks: missedBlocks.reduce(
            (result, current) => result + current.value,
            0
          )
        },
        nodes: [],
        healthStatus: node?.health_status,
        social: null,
        endpoints: {
          p2p: node.p2p_endpoint,
          api: node.api_endpoint,
          ssl: node.ssl_endpoint
        }
      }

      break

    case 'bp':
      // TODO: Modeled Block Producer data
      break

    default:
      break
  }

  return newData
}
