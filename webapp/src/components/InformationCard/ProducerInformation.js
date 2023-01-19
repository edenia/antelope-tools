import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import CountryFlag from '../CountryFlag'
import MoreInfoModal from '../MoreInfoModal'
import VisitSite from '../VisitSite'

const ProducerInformation = ({ info, classes, t }) => {
  const URLModal = ({ data }) => {
    if (!Array.isArray(data)) return <></>
    return (
      <MoreInfoModal>
        {data.map((url, index) => (
          <div className={classes.dd} key={`more-info-${url}-${index}`}>
            <Link href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </Link>
          </div>
        ))}
      </MoreInfoModal>
    )
  }

  return (
    <>
      <div className={classes.borderLine}>
        <div className={classes.flex}>
          {info?.location && info?.location !== 'N/A' && (
            <Typography variant="body1">
              {`${t('location')}: ${info?.location} `}
              <CountryFlag code={info?.country} />
            </Typography>
          )}
        </div>
        <div className={classes.flex}>
          {!!info?.website ? (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('website')}:
              </Typography>
              <VisitSite title={t('openLink')} url={info?.website} />
            </>
          ) : (
            <Typography variant="body1" className={classes.textEllipsis}>
              {t('website')}: N/A
            </Typography>
          )}
        </div>
        <div className={classes.flex}>
          {!!info?.email ? (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('email')}:
              </Typography>
              <VisitSite title={t('openLink')} url={`mailto:${info.email}`} />
            </>
          ) : (
            <Typography variant="body1" className={classes.textEllipsis}>
              {t('email')}: N/A
            </Typography>
          )}
        </div>
        <div className={classes.flex}>
          {!!info?.ownership ? (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('ownershipDisclosure')}:
              </Typography>
              <VisitSite title={t('openLink')} url={info?.ownership} />
            </>
          ) : null}
        </div>
        <div className={classes.flex}>
          {!!info?.code_of_conduct ? (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('codeofconduct')}:
              </Typography>
              <VisitSite title={t('openLink')} url={info?.code_of_conduct} />
            </>
          ) : null}
        </div>
        <div className={classes.flex}>
          {!!info?.chain ? (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('chainResources')}:
              </Typography>
              <VisitSite title={t('openLink')} url={info?.chain} />
            </>
          ) : null}
        </div>
        <div className={classes.rowWrapper}>
          {!!info?.otherResources.length && (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('otherResources')}:
              </Typography>
              <URLModal data={info?.otherResources} />
            </>
          )}
        </div>
      </div>
    </>
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
