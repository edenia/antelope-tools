import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

import styles from './styles'

const useStyles = makeStyles(styles)

const SimpleDataCard = ({
  header,
  lowercase,
  title,
  value,
  loading,
  children,
}) => {
  const classes = useStyles()

  return (
    <div className={header ? classes.cardHeader : classes.cardGrow}>
      <Card className={classes.cardShadow}>
        <CardContent className={classes.cards}>
          {title && <Typography>{title}</Typography>}
          {!loading ? (
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
  value: PropTypes.string,
  children: PropTypes.node,
}

SimpleDataCard.defaultProps = {
  header: false,
  loading: false,
  lowercase: false,
  title: '',
  value: '',
}

export default memo(SimpleDataCard)
