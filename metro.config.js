const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure tslib is properly resolved and bundled
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'tslib': require.resolve('tslib'),
};

module.exports = config;
