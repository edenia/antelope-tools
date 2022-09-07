import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import { eosConfig, generalConfig } from '../../config'

const Stats = ({ missedBlocks, t, classes, votes, rewards, type }) => {
  if (eosConfig.networkName === 'lacchain' || type === 'node') return <></>

  return (
    <div className={classes.healthStatus}>
      <Typography variant="overline">{t('stats')}</Typography>
      <div className={classes.borderLine}>
        <div className={classes.rowWrapper}>
          <Typography variant="body1">{`${t('votes')}: ${votes}`}</Typography>
        </div>

        <div className={classes.rowWrapper}>
          <Typography variant="body1">{`${t('rewards')}: ${rewards} ${
            eosConfig.tokenSymbol
          }`}</Typography>
        </div>

        {!!generalConfig.historyEnabled && (
          <div className={classes.rowWrapper}>
            <Typography variant="body1">
              {`${t('missedBlocks')}: `}
              {missedBlocks.reduce(
                (result, current) => result + current.value,
                0
              )}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

Stats.propTypes = {
  missedBlocks: PropTypes.array,
  t: PropTypes.func,
  classes: PropTypes.object,
  votes: PropTypes.string,
  rewards: PropTypes.string,
  type: PropTypes.string
}

Stats.defaultProps = {
  updatedAt: '',
  classes: {},
  votes: '0',
  rewards: '0'
}

export default memo(Stats)
