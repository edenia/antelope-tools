import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import CountryFlag from '../CountryFlag'

const Information = ({ info, classes, type, t }) => {
  if (type === 'node') {
    return (
      <Box className={classes.borderLine}>
        <Box className={classes.rowWrapper}>
          <Typography variant="body1">
            {`${t('version')}: ${info.version || '- -'}`}
          </Typography>
        </Box>
        <Box className={clsx(classes.rowWrapper, classes.boxLabel)}>
          <Box className="listLabel">
            <Typography variant="body1">{`${t('features')}:`}</Typography>
          </Box>
          <Box className="listBox">
            {info.features.length ? (
              info.features.map((feature) => (
                <Typography key={feature} variant="body1">
                  {feature}
                </Typography>
              ))
            ) : (
              <Typography variant="body1">- -</Typography>
            )}
          </Box>
        </Box>
        {info.keys ? (
          <Box
            className={clsx(
              classes.rowWrapper,
              classes.boxLabel,
              classes.flexColumn
            )}
          >
            {Object.keys(info.keys).map((key, i) => (
              <Box display="flex" key={i}>
                <Box className="listLabel">
                  <Typography variant="body1">{`${t(key)}:`}</Typography>
                </Box>
                <Box className="listBox">
                  <Typography variant="body1" className={classes.textWrap}>
                    {info.keys[key]}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className={classes.rowWrapper}>
            <Typography variant="body1">{`${t('keys')}: - -`}</Typography>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box className={classes.borderLine}>
      <Box className={classes.rowWrapper}>
        <Typography variant="body1">
          {`${t('location')}: ${info.location || '- -'} `}
          <CountryFlag code={info.country} />
        </Typography>
      </Box>
      <Box className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${t('website')}: `}
          <Link
            href={info.website || ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            {info.website || 'N/A'}
          </Link>
        </Typography>
      </Box>
      <Box className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${t('email')}: `}
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
      </Box>
      <Box className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${t('ownershipDisclosure')}: `}
          {info.ownership ? (
            <Link
              href={info.ownership}
              target="_blank"
              rel="noopener noreferrer"
            >
              {info.ownership}
            </Link>
          ) : (
            'N/A'
          )}
        </Typography>
      </Box>
      <Box className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${t('chainResources')}: `}
          {info.chain ? (
            <Link href={info.chain} target="_blank" rel="noopener noreferrer">
              {info.chain}
            </Link>
          ) : (
            'N/A'
          )}
        </Typography>
      </Box>
      {!!info.otherResources?.length && (
        <Box>
          <dt className={classes.dt}>
            <Typography variant="body1" className={classes.textEllipsis}>
              {t('otherResources')}:
            </Typography>
          </dt>
          {info.otherResources.map((url, i) => (
            <dd className={classes.dd} key={i}>
              <Link href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </Link>
            </dd>
          ))}
        </Box>
      )}
    </Box>
  )
}

Information.propTypes = {
  type: PropTypes.string,
  info: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func
}

Information.defaultProps = {
  type: '',
  info: {},
  classes: {}
}

export default memo(Information)
