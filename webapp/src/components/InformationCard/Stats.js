import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { eosConfig } from '../../config'

const Stats = ({ missedBlocks, t, classes, votes, rewards }) => {
  if (eosConfig.networkName === 'lacchain') return <></>

  return (
    <Box className={classes.healthStatus}>
      <Typography variant="overline">{t('stats')}</Typography>
      <Box className={classes.borderLine}>
        <Box className={classes.rowWrapper}>
          <Typography variant="body1">{`${t(
            'votes'
          )}: ${votes}eos`}</Typography>
        </Box>

        <Box className={classes.rowWrapper}>
          <Typography variant="body1">{`${t(
            'rewards'
          )}: ${rewards}`}</Typography>
        </Box>

        <Box className={classes.rowWrapper}>
          {' '}
          <Typography variant="body1">
            {`${t('missedBlocks')}: `}
            {missedBlocks.reduce(
              (result, current) => result + current.value,
              0
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

Stats.propTypes = {
  missedBlocks: PropTypes.array,
  t: PropTypes.func,
  classes: PropTypes.object,
  votes: PropTypes.string,
  rewards: PropTypes.string
}

Stats.defaultProps = {
  updatedAt: '',
  classes: {},
  votes: '0',
  rewards: '0'
}

export default memo(Stats)
