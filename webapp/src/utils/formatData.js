/* eslint complexity: 0 */
/* eslint camelcase: 0 */
import { eosConfig } from '../config'
import { ENTITY_TYPE } from './lacchain'

export const formatData = ({
  data,
  rank,
  owner,
  healthStatus,
  dataType,
  totalRewards,
  url
}) => {
  const getSubTitle = () => {
    if (eosConfig.networkName === 'lacchain') return `${ENTITY_TYPE[dataType]}`

    if (rank <= 21) return 'Top 21'

    if (rank > 21 && totalRewards >= 100) return 'Paid Standby'

    return 'Non-Paid Standby'
  }

  if (!Object.keys(data || {}).length) {
    return { hasEmptyBPJson: true, health_status: [{ name: "bpJson", valid: false }], media: { name: owner, account: getSubTitle(), website: url } }
  }

  let newData = {
    media: {},
    info: {},
    social: {},
  }

  const prefix = {
    keybase: 'https://keybase.io/',
    telegram: 'https://t.me/',
    twitter: 'https://twitter.com/',
    github: 'https://github.com/',
    youtube: 'https://youtube.com/',
    facebook: 'https://facebook.com/',
    hive: 'https://hive.blog/@',
    reddit: 'https://www.reddit.com/user/',
    wechat: 'https://wechat.com/',
  }

  const order = {
    twitter: 0,
    github: 1,
    telegram: 2,
    youtube: 3,
    reddit: 4,
    wechat: 5,
    keybase: 6,
    hive: 7,
    facebook: 8,
  }

  const getOrder = name => order[name] ?? Infinity

  if (!data?.social?.github && typeof data?.github_user === 'string') {
    data.social.github = data.github_user
  }

  const socialArray = Object.keys(prefix || {})
    .sort((a, b) => getOrder(a) - getOrder(b))
    .flatMap((key) =>
      data.social[key]
        ? {
            name: key,
            url: `${prefix[key] ?? 'https://' + key + '/'}${data.social[key]}`,
          }
        : [],
    )

  newData = {
    ...newData,
    media: {
      logo: data?.branding?.logo_256,
      name: data?.candidate_name || data?.organization_name || owner,
      account: getSubTitle(),
      website: data?.website || '',
      email: data?.email,
    },
    location: data?.location?.name || 'N/A',
    country: data?.location?.country || null,
    info: {
      codeOfConduct: data?.code_of_conduct,
      ownership: data?.ownership_disclosure,
      chainResources: data?.chain_resources,
      otherResources: data?.other_resources,
    },
    social: socialArray,
    ...(healthStatus && {
      compliance: {
        total: healthStatus?.length,
        pass: healthStatus?.reduce((a, b) => a + Number(b.valid), 0),
      },
    }),
  }

  return newData
}
