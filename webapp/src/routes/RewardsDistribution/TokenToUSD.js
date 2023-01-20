import React, { memo } from 'react'

import { formatWithThousandSeparator } from '../../utils'
import { eosConfig } from '../../config'

const TokenToUSD = ({ amount, tokenPrice }) => {
  return (
    <span>
      {`${formatWithThousandSeparator(amount, 2)} ${eosConfig.tokenSymbol}`}
      {tokenPrice &&
        `/ $${formatWithThousandSeparator(amount * tokenPrice, 2)} USD`}
    </span>
  )
}

export default memo(TokenToUSD)
