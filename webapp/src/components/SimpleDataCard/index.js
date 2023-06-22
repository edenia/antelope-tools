import React from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import styles from './styles'

const useStyles = makeStyles(styles)

const SimpleDataCard = ({ key, header, children }) => {
  const classes = useStyles()

  return (
    <div className={header ? classes.cardHeader : classes.cardGrow} key={key}>
      <Card className={classes.cardShadow}>
        <CardContent className={classes.cards}>{children}</CardContent>
      </Card>
    </div>
  )
}

SimpleDataCard.propTypes = {
  key: PropTypes.string,
  header: PropTypes.bool,
  children: PropTypes.node,
}

SimpleDataCard.defaultProps = {
  key: '',
  header: false,
}

export default SimpleDataCard
