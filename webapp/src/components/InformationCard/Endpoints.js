import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import Link from '@mui/material/Link'

const Endpoints = ({ endpoints, classes, type, t }) => {
  if (type !== 'node') return <></>

  const items = Object.keys(endpoints || {}).filter((key) => !!endpoints[key])

  if (!items.length)
    return (
      <div className={clsx(classes.info, classes.entity)}>
        <Typography variant="overline">Endpoints</Typography>
        <div className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </div>
      </div>
    )

  return (
    <div className={clsx(classes.info, classes.entity)}>
      <Typography variant="overline">Endpoints</Typography>
      <div className={classes.borderLine}>
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
      </div>
    </div>
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
