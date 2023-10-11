const components = {
  MuiCssBaseline: {
    styleOverrides: theme =>
      `
        .simple-card {
          background-color: ${theme.palette.background.main};
          box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          padding: ${theme.spacing(4)};
        },
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
}

export default components
