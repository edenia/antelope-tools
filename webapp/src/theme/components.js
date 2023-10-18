const components = {
  MuiCssBaseline: {
    styleOverrides: theme =>
      `
        .MuiPaper-root {
          box-shadow: ${theme.palette.shadows.card} !important;
        }
        .MuiAppBar-root {
          background-color: ${theme.palette.background.paper} !important;
        }
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
