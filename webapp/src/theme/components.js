const components = {
  MuiCssBaseline: {
    styleOverrides: theme =>
      `
        .MuiTypography-capSubtitle {
          color: ${theme.palette.neutral.dark};
        }
      `,
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        capSubtitle: 'span',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 30,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        padding: 16
      },
    },
  },
}

export default components
