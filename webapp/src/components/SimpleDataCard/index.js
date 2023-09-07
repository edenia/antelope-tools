import React, { memo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

import styles from './styles'
import MoreInfoTooltip from './MoreInfoTooltip'

const useStyles = makeStyles(styles)

const SimpleDataCard = ({
  header,
  lowercase,
  title,
  helperText,
  value,
  loading,
  children,
}) => {
  const classes = useStyles()
  const isNotLoading = !loading || !!value?.toString()
  const [open, setOpen] = useState(false)

  const handleOpenTooltip = () => {
    setOpen(true)
  }

  const handleCloseTooltip = () => {
    setOpen(false)
  }

  return (
    <div className={header ? classes.cardHeader : classes.cardGrow}>
      <Card
        onMouseOver={helperText ? handleOpenTooltip : null}
        onMouseMove={helperText ? handleOpenTooltip : null}
        onMouseOut={helperText ? handleCloseTooltip : null}
        className={`${classes.cardShadow} ${
          helperText ? classes.tooltipHover : ''
        }`}
      >
        <CardContent className={classes.cards}>
          {title && (
            <div className={classes.titleContainer}>
              <Typography component="h2" className={classes.title}>
                {title}
              </Typography>
              {helperText && (
                <MoreInfoTooltip
                  helperText={helperText}
                  open={open}
                  handleOpenTooltip={handleOpenTooltip}
                  handleCloseTooltip={handleCloseTooltip}
                />
              )}
            </div>
          )}
          {isNotLoading ? (
            value ? (
              <Typography
                component="p"
                variant="h6"
                className={`${classes.textValue} ${
                  lowercase ? classes.lowercase : ''
                }`}
              >
                {value}
                {children}
              </Typography>
            ) : (
              <>{children}</>
            )
          ) : (
            <LinearProgress />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

SimpleDataCard.propTypes = {
  header: PropTypes.bool,
  lowercase: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helperText: PropTypes.string,
  children: PropTypes.node,
}

SimpleDataCard.defaultProps = {
  header: false,
  loading: false,
  lowercase: false,
  title: '',
  value: '',
  helperText: '',
}

export default memo(SimpleDataCard)
