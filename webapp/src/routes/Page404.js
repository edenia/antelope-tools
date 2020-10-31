import React from 'react'
import { Button as MuiButton, Typography } from '@material-ui/core'
import { spacing } from '@material-ui/system'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

const Button = styled(MuiButton)(spacing)
const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)}px;
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`

const Page404 = () => (
  <Wrapper>
    <Helmet title="404 Error" />
    <Typography component="h1" variant="h1" align="center" gutterBottom>
      404
    </Typography>
    <Typography component="h2" variant="h5" align="center" gutterBottom>
      Page not found.
    </Typography>
    <Typography component="h2" variant="body1" align="center" gutterBottom>
      The page you are looking for might have been removed.
    </Typography>

    <Button
      component={Link}
      to="/"
      variant="contained"
      color="secondary"
      mt={2}
    >
      Return to website
    </Button>
  </Wrapper>
)

export default Page404
