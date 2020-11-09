import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Grid,
  Hidden,
  List,
  ListItemText,
  ListItem as MuiListItem
} from '@material-ui/core'

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(1) / 4}px
    ${(props) => props.theme.spacing(4)}px;
  background: ${(props) => props.theme.palette.common.white};
  position: relative;
`

const ListItem = styled(MuiListItem)`
  display: inline-block;
  width: auto;
  padding-left: ${(props) => props.theme.spacing(2)}px;
  padding-right: ${(props) => props.theme.spacing(2)}px;

  &,
  &:hover,
  &:active {
    color: #000;
  }
`

function Footer() {
  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Hidden smDown>
          <Grid container item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText primary={<Link to="#">Support</Link>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<Link to="#">Help Center</Link>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<Link to="#">Privacy</Link>} />
              </ListItem>
              <ListItem>
                <ListItemText primary={<Link to="#">Terms of Service</Link>} />
              </ListItem>
            </List>
          </Grid>
        </Hidden>
        <Grid container item xs={12} md={6} justify="flex-end">
          <List>
            <ListItem>
              <ListItemText primary="" />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Footer
