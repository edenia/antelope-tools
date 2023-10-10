export default (theme) => ({
    socialLinksContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing(4),
      '& svg': {
        width: '24px',
        height: '24px',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.3)',
        },
      },
    },
    tableRow: {
      '& .MuiTableCell-root': {
        padding: `${theme.spacing(1, 2)} !important`,
      },
      '&:hover': {
        backgroundColor: '#f0f3fa',
      },
    },
    tableHead: {
      borderBottom: `2px solid ${theme.palette.primary.main} !important`,
      '& .MuiTableCell-root': {
        padding: `${theme.spacing(0, 2, 2)} !important`,
      },
    },
    hideOnMobile: {
      [theme.breakpoints.down('md')]: {
        display: 'none !important',
      },
    },
    hideOnDesktop: {
      [theme.breakpoints.up('md')]: {
        display: 'none !important',
      },
    },
    website: {
      [theme.breakpoints.down('xl')]: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis', 
        width: '140px',
      },
    },
    country: {
      [theme.breakpoints.down('md')]: {
        textAlign: 'center'
      },
    },
  })
  