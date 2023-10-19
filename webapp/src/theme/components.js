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
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: theme.palette.shadows.card,
        backgroundImage: 'none',
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        padding: 16
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 30,
      },
    },
  },
}

export default components
