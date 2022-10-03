import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Typography from '@mui/material/Typography'

const NodeInformation = ({ info, classes, t }) => {
  if (!info?.version && !info?.features?.length && !info?.keys) {
    return (
      <div className={classes.borderLine}>
        <Typography>{t('noData')}</Typography>
      </div>
    )
  }

  return (
    <div className={classes.borderLine}>
      {info?.version && (
        <div className={classes.rowWrapper}>
          <Typography variant="body1">
            {`${t('version')}: ${info?.version}`}
          </Typography>
        </div>
      )}
      {Array.isArray(info?.features) && info.features.length > 0 && (
        <div className={clsx(classes.rowWrapper, classes.boxLabel)}>
          <div className="listLabel">
            <Typography variant="body1">{`${t('features')}:`}</Typography>
          </div>
          <div className="listBox">
            {info.features.map((feature) => (
              <Typography key={feature} variant="body1">
                {feature}
              </Typography>
            ))}
          </div>
        </div>
      )}
      {!!info?.keys && (
        <div
          className={clsx(
            classes.rowWrapper,
            classes.boxLabel,
            classes.flexColumn,
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

NodeInformation.propTypes = {
  info: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
}

NodeInformation.defaultProps = {
  info: {},
  classes: {},
}

export default NodeInformation
