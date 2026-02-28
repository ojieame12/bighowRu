module.exports = {
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false,
            // Prevent gradient/clipPath ID collisions across SVGs on the same page
            cleanupIds: false,
          },
        },
      },
      // Add filename-based prefix to all IDs as extra collision safety
      { name: 'prefixIds' },
    ],
  },
};
