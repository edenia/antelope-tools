import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

const Endpoints = ({ endpoints, classes, type, t }) => {
  if (type !== 'node') return <></>

  const items = Object.keys(endpoints || {}).filter((key) => !!endpoints[key])

  if (!items.length)
    return (
      <Box className={clsx(classes.info, classes.entity)}>
        <Typography variant="overline">Endpoints</Typography>
        <Box className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </Box>
      </Box>
    )

  return (
    <Box className={clsx(classes.info, classes.entity)}>
      <Typography variant="overline">Endpoints</Typography>
      <Box className={classes.borderLine}>
        {items.map((endpoint, i) => (
          <Typography variant="body1" key={i}>
            {`${endpoint.toUpperCase()}:`}
            <Link
              href={endpoints[endpoint]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {endpoints[endpoint] || 'N/A'}
            </Link>
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

Endpoints.propTypes = {
  endpoints: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  type: PropTypes.string
}

Endpoints.defaultProps = {
  type: '',
  endpoints: {}
}

export default memo(Endpoints)
