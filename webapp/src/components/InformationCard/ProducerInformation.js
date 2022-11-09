import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import CountryFlag from '../CountryFlag'

const ProducerInformation = ({ info, classes, t }) => {
  const RowUrl = ({ title, value, href }) => {
    return (
      <div className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${title}: `}
          {!!value ? (
            <Link
              href={href ?? value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value}
            </Link>
          ) : (
            'N/A'
          )}
        </Typography>
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
      <RowUrl title={t('website')} value={info?.website} /> 
      <RowUrl
        title={t('email')}
        value={info?.email}
        href={`mailto:${info.email}`}
      />
      <RowUrl title={t('ownershipDisclosure')} value={info?.ownership} />
      <RowUrl title={t('codeofconduct')} value={info?.code_of_conduct} />
      <RowUrl title={t('chainResources')} value={info?.chain} />
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

ProducerInformation.propTypes = {
  info: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
}

ProducerInformation.defaultProps = {
  info: {},
  classes: {},
}

export default memo(ProducerInformation)
