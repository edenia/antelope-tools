import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Typography from '@mui/material/Typography'

const NodeInformation = ({ info, classes, t }) => {
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
          {Array.isArray(info?.features) && info.features.length > 0 ? (
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
