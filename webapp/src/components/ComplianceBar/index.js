import React from 'react'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import styles from './styles'

const useStyles = makeStyles(styles)

const PercentageBar = styled.div`
    width: ${props => props.width}px;
    height: 8px;
    & div {
      border-radius: ${props => props.theme.spacing(4)};
      position: relative;
      height: 100%;
      max-width: 100%;
    }
    & > div + div {
      width: ${props => props.percentage * props.width}px;
      top: -100%;
      background-color: ${props =>
        props.percentage >= 0.8
          ? props.theme.palette.success.main
          : props.percentage >= 0.5
          ? props.theme.palette.warning.main
          : props.theme.palette.error.main};
    }
  `

const ComplianceBar = ({ pass, total }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography variant="body1">{`${pass}/${total}`}</Typography>
      <PercentageBar width={120} percentage={pass / total ?? 0}>
        <div className={classes.bar}></div>
        <div />
      </PercentageBar>
    </div>
  )
}

export default ComplianceBar
