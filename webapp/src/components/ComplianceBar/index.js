import React from 'react'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import styles from './styles'

const useStyles = makeStyles(styles)

const ComplianceBar = ({ pass, total }) => {
  const classes = useStyles()

  const maxWidth = 120
  const percentage = pass / total ?? 0

  const Bar = styled.div`
    width: ${maxWidth}px;
    height: 8px;
    & div {
      border-radius: ${props => props.theme.spacing(4)};
      position: relative;
      height: 100%;
      max-width: 100%;
    }
  `
  const CompliancePercentageBar = styled.div`
    width: ${percentage * maxWidth}px;
    top: -100%;
    background-color: ${props =>
      percentage >= 0.8
        ? props.theme.palette.success.main
        : percentage >= 0.5
        ? props.theme.palette.warning.main
        : props.theme.palette.error.main};
  `

  return (
    <div className={classes.container}>
      <Typography variant="body1">{`${pass}/${total}`}</Typography>
      <Bar>
        <div className={classes.bar}></div>
        <CompliancePercentageBar />
      </Bar>
    </div>
  )
}

export default ComplianceBar
