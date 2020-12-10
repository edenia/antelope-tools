import React from 'react'
import styled from 'styled-components'
import {
  Grid,
  List,
  ListItemText,
  ListItem as MuiListItem
} from '@material-ui/core'

import { generalConfig } from '../config'

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
      <Grid container item xs={12}>
        <List>
          {generalConfig.footerLinks.map((link, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <a href={link.src} target="_blank" rel="noopener noreferrer">
                    {link.text}
                  </a>
                }
              />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Wrapper>
  )
}

export default Footer
