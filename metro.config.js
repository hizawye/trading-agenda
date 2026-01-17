// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// CRITICAL: Add .mjs to asset extensions for tslib resolution
config.resolver.assetExts.push('mjs');

// Keep existing tslib resolver
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'tslib': require.resolve('tslib'),
};

module.exports = config;
