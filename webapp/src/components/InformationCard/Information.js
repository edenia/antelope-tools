import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import CountryFlag from '../CountryFlag'

const Information = ({ info, classes, type, t }) => {
  if (type === 'node') {
    return (
      <div className={classes.borderLine}>
        <div className={classes.rowWrapper}>
          <Typography variant="body1">
            {`${t('version')}: ${info?.version || '- -'}`}
          </Typography>
        </div>
        <div className={clsx(classes.rowWrapper, classes.boxLabel)}>
          <div className="listLabel">
            <Typography variant="body1">{`${t('features')}:`}</Typography>
          </div>
          <div className="listBox">
            {Array.isArray(info?.features) && info.features.length > 0  ? (
              info.features.map((feature) => (
                <Typography key={feature} variant="body1">
                  {feature}
                </Typography>
              ))
            ) : (
              <Typography variant="body1">- -</Typography>
            )}
          </div>
        </div>
        {!!info?.keys && (
          <div
            className={clsx(
              classes.rowWrapper,
              classes.boxLabel,
              classes.flexColumn
            )}
          >
            {Object.keys(info.keys).map((key, i) => (
              <div display="flex" key={i}>
                <div className="listLabel">
                  <Typography variant="body1">{`${t(key)}:`}</Typography>
                </div>
                <div className="listBox">
                  <Typography variant="body1" className={classes.textWrap}>
                    {info.keys[key]}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={classes.borderLine}>
      <div className={classes.rowWrapper}>
        {info?.location && info?.location !== 'N/A' && (
          <Typography variant="body1">
            {`${t('location')}: ${info?.location} `}
            <CountryFlag code={info?.country} />
          </Typography>
        )}
      </div>
      <div className={classes.rowWrapper}>
        {!!info?.website && (
          <Typography variant="body1" className={classes.textEllipsis}>
            {`${t('website')}: `}
            <Link
              href={info?.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {info?.website}
            </Link>
          </Typography>
        )}
      </div>
      <div className={classes.rowWrapper}>
        {!!info?.email && (
          <Typography variant="body1" className={classes.textEllipsis}>
            {`${t('email')}: `}
            <Link
              href={`mailto:${info.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {info.email}
            </Link>
          </Typography>
        )}
      </div>
      <div className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${t('ownershipDisclosure')}: `}
          {!!info?.ownership ? (
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
      </div>
      <div className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${t('chainResources')}: `}
          {info?.chain ? (
            <Link href={info.chain} target="_blank" rel="noopener noreferrer">
              {info.chain}
            </Link>
          ) : (
            'N/A'
          )}
        </Typography>
      </div>
      {!!info?.otherResources?.length && (
        <div>
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
        </div>
      )}
    </div>
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
