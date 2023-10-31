/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'

import { eosConfig } from '../../config'

import ProducerRow from './ProducerRow'
import ProducersTable from './ProducersTable'

const ProducersList = ({ producers }) => {
  return (
    <ProducersTable
      columnsNames={eosConfig.producerColumns}
      producers={producers}
      RowComponent={ProducerRow}
    />
  )
}

ProducersList.propTypes = {
  producers: PropTypes.array,
}

ProducersList.defaultProps = {
  producers: [],
}

export default ProducersList
