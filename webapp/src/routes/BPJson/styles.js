export default (theme) => ({
  generatorContainer: {
    '& .pretty-json-container': {
      '& span': {
        color: `${theme.palette.text.primary} !important`,
        '& svg': {
          color: `${theme.palette.primary.main} !important`,
        },
      },
      '& .node-ellipsis': {
        color: `${theme.palette.primary.main} !important`,
      },
    },
    '& section > div': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
    },
  },
})
