const components = {
  MuiCssBaseline: {
    styleOverrides: theme =>
      `
        body {
          background-color: ${theme.palette.background.light};
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
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#616161',
      },
    },
  },
}

export default components
