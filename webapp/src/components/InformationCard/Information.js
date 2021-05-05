import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import CountryFlag from '../CountryFlag'

const Information = ({ info, classes, type }) => {
  if (type === 'node') {
    return (
      <Box className={classes.info}>
        <Typography variant="overline">Info</Typography>
        <Typography variant="body1">
          Version:{` ${info.version || '- -'}`}
        </Typography>
        {info.features.length ? (
          <dl>
            <dt>
              <Typography variant="body1">Features:</Typography>
            </dt>
            {info.features.map((feature) => (
              <dd key={feature}>
                <Typography variant="body1">{feature}</Typography>
              </dd>
            ))}
          </dl>
        ) : (
          <Typography variant="body1">Features: - -</Typography>
        )}
        {info.keys ? (
          <dl>
            <dt>
              <Typography variant="body1">Keys:</Typography>
            </dt>
            {Object.keys(info.keys).map((key, i) => (
              <dd key={i}>
                <Typography variant="body1">{key}</Typography>
                <Typography variant="body1">{info.keys[key]}</Typography>
              </dd>
            ))}
          </dl>
        ) : (
          <Typography variant="body1">Keys: - -</Typography>
        )}
      </Box>
    )
  }

  return (
    <Box className={classes.info}>
      <Typography variant="overline">Info</Typography>
      <Typography variant="body1">
        Location:{` ${info.location || 'N/A'} `}
        <CountryFlag code={info.country} />
      </Typography>
      <Typography variant="body1">
        Website:{' '}
        <Link href={info.website} target="_blank" rel="noopener noreferrer">
          {info.website}
        </Link>
      </Typography>
      <Typography variant="body1">
        Email:{' '}
        {info.email ? (
          <Link
            href={`mailto:${info.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {info.email}
          </Link>
        ) : (
          'N/A'
        )}
      </Typography>
      <Typography variant="body1">
        Ownership Disclosure:{' '}
        {info.ownership ? (
          <Link href={info.ownership} target="_blank" rel="noopener noreferrer">
            {info.ownership}
          </Link>
        ) : (
          'N/A'
        )}
      </Typography>
      <Typography variant="body1">
        Chain Resources:{' '}
        {info.chain ? (
          <Link href={info.chain} target="_blank" rel="noopener noreferrer">
            {info.chain}
          </Link>
        ) : (
          'N/A'
        )}
      </Typography>
    </Box>
  )
}

Information.propTypes = {
  type: PropTypes.string,
  info: PropTypes.object,
  classes: PropTypes.object
}

Information.defaultProps = {
  type: '',
  info: {},
  classes: {}
}

export default memo(Information)
