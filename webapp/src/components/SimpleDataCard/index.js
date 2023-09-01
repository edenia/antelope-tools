import React, { memo } from 'react'
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

  return (
    <div className={header ? classes.cardHeader : classes.cardGrow}>
      <Card className={classes.cardShadow}>
        <CardContent className={classes.cards}>
          {title && (
            <div className={classes.titleContainer}>
              <Typography>{title}</Typography>
              {helperText && <MoreInfoTooltip helperText={helperText} />}
            </div>
          )}
          {isNotLoading ? (
            <Typography
              component="p"
              variant="h6"
              className={lowercase ? classes.lowercase : ''}
            >
              {value}
              {children}
            </Typography>
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
