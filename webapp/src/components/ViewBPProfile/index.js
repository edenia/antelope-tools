import React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import LaunchIcon from '@mui/icons-material/Launch'

const ViewBPProfile = ({ name, producer }) => {
  return (
    <Button
      component={Link}
      to={`/block-producers/${name}`}
      state={{ producer }}
      variant="contained"
      color="secondary"
      mt={2}
      endIcon={<LaunchIcon/>}
    >
      View BP Profile
    </Button>
  )
}

export default ViewBPProfile
