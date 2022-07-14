import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const Nodes = ({ nodes, producer, onNodeClick, t, type, classes }) => {
  if (type === 'node') return <></>

  if (!nodes.length)
    return (
      <Box className={classes.nodes}>
        <Typography variant="overline">{t('nodes')}</Typography>
        <Box className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </Box>
      </Box>
    )

  return (
    <Box className={classes.nodes}>
      <Typography variant="overline">{t('nodes')}</Typography>
      <Box className={classes.borderLine}>
        <Box>
          {nodes.map((node, i) => (
            <Box className={classes.rowWrapper} key={`node-${i}`}>
              <Typography variant="body1">
                {node.name || node.node_type}{' '}
              </Typography>
              <InfoOutlinedIcon onClick={onNodeClick({ node, producer })} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.array,
  producer: PropTypes.object,
  onNodeClick: PropTypes.func,
  classes: PropTypes.object,
  t: PropTypes.func,
  type: PropTypes.string
}

Nodes.defaultProps = {
  type: '',
  nodes: [],
  producer: {},
  onNodeClick: () => {},
  classes: {}
}

export default memo(Nodes)
