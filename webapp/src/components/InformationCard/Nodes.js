import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const Nodes = ({ nodes, producer, onNodeClick, t, type }) => {
  if (type === 'node') return <></>

  return (
    <Box className="nodes">
      <Typography variant="overline">{t('nodes')}</Typography>
      <Box>
        {nodes.length > 0 && (
          <>
            {nodes.map((node, i) => (
              <Typography variant="body1" key={`node-${i}`}>
                {node.node_name || node.node_type}{' '}
                <InfoOutlinedIcon onClick={onNodeClick({ node, producer })} />
              </Typography>
            ))}
          </>
        )}
      </Box>
    </Box>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.array,
  producer: PropTypes.object,
  onNodeClick: PropTypes.func,
  t: PropTypes.func,
  type: PropTypes.string
}

Nodes.defaultProps = {
  type: '',
  nodes: [],
  producer: {},
  onNodeClick: () => {}
}

export default memo(Nodes)
