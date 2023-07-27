import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import { eosConfig, generalConfig } from '../../config'
import VisitSite from '../VisitSite'

const Stats = ({ missedBlocks, t, classes, votes, rewards, eosRate }) => {
  if (eosConfig.networkName === 'lacchain') return <></>

  return (
    <div className={classes.stats}>
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

        {!!eosRate && (
          <div className={classes.rowWrapper}>
            <Typography variant="body1" className={classes.ratings}>
              {`${t('EOSRate')}: 
              ${eosRate.average.toFixed(2)} ${t('average')} 
              (${eosRate.ratings_cntr} ${t('ratings')})`}
            </Typography>
            <VisitSite
              title={t('openLink')}
              url={`${generalConfig.eosRateLink}/block-producers/${eosRate.bp}`}
            />
          </div>
        )}

        {!!generalConfig.historyEnabled && (
          <div className={classes.rowWrapper}>
            <Typography variant="body1">
              {`${t('missedBlocks')}: `}
              {missedBlocks || 0}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

Stats.propTypes = {
  missedBlocks: PropTypes.number,
  t: PropTypes.func,
  classes: PropTypes.object,
  votes: PropTypes.string,
  rewards: PropTypes.string,
  type: PropTypes.string,
}

Stats.defaultProps = {
  updatedAt: '',
  classes: {},
  votes: '0',
  rewards: '0',
}

export default memo(Stats)
