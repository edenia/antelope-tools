import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'

const Endpoints = ({ endpoints, classes, type, t }) => {
  if (type !== 'node') return <></>

  return (
    <Box className={classes.info}>
      <Typography variant="overline">Endpoints</Typography>
      {Object.keys(endpoints).map((endpoint, i) => (
        <Typography variant="body1" key={i}>
          {`${endpoint}: `}
          <Link
            href={endpoints[endpoint]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {endpoints[endpoint]}
          </Link>
        </Typography>
      ))}
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
