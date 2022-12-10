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
    missedBlocks = [],
    nodes,
    healthStatus,
    dataType,
    totalRewards,
  },
  type,
  t,
) => {
  let newData = {
    title: '',
    media: {},
    info: {},
    stats: {},
    nodes: [],
    healthStatus: [],
    social: {},
    endpoints: {},
  }

  const getSubTitle = () => {
    if (eosConfig.networkName === 'lacchain')
      return `${t(`entityType${dataType}`)} Entity`

    if (rank <= 21) return 'Top 21'

    if (rank > 21 && totalRewards >= 100) return 'Paid Standby'

    return 'Non-Paid Standby'
  }

  const getEntitiesMissedBlocks = () => {
    if (!nodes.length) return 0

    const producerNode = nodes.find((node) => node?.node_type === 'producer')

    if (producerNode) return 0

    return missedBlocks[owner] || 0
  }

  if (!data?.social?.github && typeof data?.github_user === 'string') {
    data.social.github = data.github_user
  }

  switch (type) {
    case 'entity':
    case 'node':
      if (eosConfig.networkName === 'lacchain') {
        newData.title = owner
      } else {
        newData.title = rank ? `#${rank} - ${owner}` : owner
      }

      newData = {
        ...newData,
        media: {
          logo: data.branding?.logo_256,
          name: data.candidate_name || data.organization_name || owner,
          account: getSubTitle(),
        },
        info: {
          location: data.location?.name || 'N/A',
          country: data.location?.country || null,
          website: data?.website || '',
          email: data.email,
          code_of_conduct: data?.code_of_conduct || null,
          ownership: data?.ownership_disclosure || null,
          bussinesContact: data.bussines_contact || null,
          technicalContact: data.technical_contact || null,
          chain: data?.chain_resources || null,
          otherResources: data?.other_resources || [],
        },
        stats: {
          votes: 'N/A',
          rewards: 0,
          lastChecked: moment(new Date()).diff(moment(updatedAt), 'seconds'),
          missedBlocks: getEntitiesMissedBlocks(),
        },
        nodes,
        healthStatus,
        social: data.social,
      }

      break

    default:
      break
  }

  return newData
}
