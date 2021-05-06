import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import moment from 'moment'

import { eosConfig } from '../../config'

const Stats = ({ updatedAt, missedBlocks, t }) => {
  return (
    <Box className="stats">
      <Typography variant="overline">{t('stats')}</Typography>
      {eosConfig.networkName !== 'lacchain' && (
        <>
          <Typography variant="body1">{t('votes')}</Typography>
          <Typography variant="body1">{t('rewards')}</Typography>
        </>
      )}
      <Typography variant="body1">
        {`${t('lastChecked')} ${moment(new Date()).diff(
          moment(updatedAt),
          'seconds'
        )} ${t('secondsAgo')}`}
      </Typography>
      <Typography variant="body1">
        {t('missedBlocks')}
        {missedBlocks.reduce((result, current) => result + current.value, 0)}
      </Typography>
    </Box>
  )
}

Stats.propTypes = {
  missedBlocks: PropTypes.array,
  t: PropTypes.func,
  updatedAt: PropTypes.string
}

Stats.defaultProps = {
  updatedAt: '',
  missedBlocks: []
}

export default memo(Stats)
