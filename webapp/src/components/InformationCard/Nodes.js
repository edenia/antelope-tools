import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import Tooltip from '../../components/Tooltip'
import NodeCard from '../../components/NodeCard'

const Nodes = ({ nodes, producer, t, classes }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selected, setSelected] = useState(null)

  const handlePopoverOpen = (target, node) => {
    setAnchorEl(target)
    setSelected(node)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setSelected(null)
  }

  if (!nodes?.length) {
    return (
      <div className={classes.nodes}>
        <Typography variant="overline">{t('nodes')}</Typography>
        <div className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.nodes}>
      <Typography variant="overline">{t('nodes')}</Typography>
      <div className={classes.borderLine}>
        <>
          {nodes.map((node, index) => (
            <div
              key={`node-${
                producer?.owner
              }-${node?.node_type?.toString()}-${index}`}
            >
              <Tooltip
                anchorEl={anchorEl}
                open={anchorEl !== null && node === selected}
                onClose={handlePopoverClose}
              >
                <NodeCard node={node} producer={producer} />
              </Tooltip>
              <div className={classes.flex}>
                <Typography
                  variant="body1"
                  className={classes.textEllipsisNodes}
                >
                  {node.name || node?.node_type?.toString() || 'node'}{' '}
                </Typography>
                <InfoOutlinedIcon
                  className={classes.clickableIcon}
                  onClick={(event) => {
                    handlePopoverOpen(event.target, node)
                  }}
                />
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.array,
  producer: PropTypes.object,
  onNodeClick: PropTypes.func,
  classes: PropTypes.object,
  t: PropTypes.func,
}

Nodes.defaultProps = {
  nodes: [],
  producer: {},
  onNodeClick: () => {},
  classes: {},
}

export default memo(Nodes)
