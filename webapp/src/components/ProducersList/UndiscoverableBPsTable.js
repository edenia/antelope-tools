/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'

import NonCompliantCard from '../../components/NonCompliantCard'

import ProducersTable from './ProducersTable'

const UndiscoverableBPsTable = ({ producers, tokenPrice }) => {
  const columnsNames = [
    'rank',
    'producerName',
    'website',
    'bpJson',
    'votes',
    'lastClaimTime',
    'dailyRewards',
    'yearlyRewards',
  ]

  return (
    <ProducersTable
      columnsNames={columnsNames}
      producers={producers}
      RowComponent={NonCompliantCard}
      RowProps={{ tokenPrice }}
    />
  )
}

UndiscoverableBPsTable.propTypes = {
  producers: PropTypes.array,
  tokenPrice: PropTypes.number,
}

UndiscoverableBPsTable.defaultProps = {
  producers: [],
  tokenPrice: NaN,
}

export default UndiscoverableBPsTable
