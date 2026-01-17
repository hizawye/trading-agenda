const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// CRITICAL: Add .mjs to asset extensions for tslib resolution
// Metro doesn't resolve tslib's .mjs files by default, causing __extends errors
config.resolver.assetExts = [...(config.resolver.assetExts || []), 'mjs'];

// Ensure tslib is properly resolved and bundled
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'tslib': require.resolve('tslib'),
};

module.exports = config;
