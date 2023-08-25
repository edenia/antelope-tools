import React from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'
import LaunchIcon from '@mui/icons-material/Launch'

import styles from './styles'

const useStyles = makeStyles(styles)

const BodyGraphValue = ({ loading, links }) => {
  const classes = useStyles()

  if (loading) return <LinearProgress />

  return (
    <>
      {links &&
        links.map((href, index) => (
          <a
            aria-label={`Link to block explorer`}
            key={`link-body-graph-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LaunchIcon className={classes.svgLink} color="primary" />
          </a>
        ))}
    </>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  href: PropTypes.string,
}

BodyGraphValue.defaultProps = {
  loading: false,
}

export default BodyGraphValue
