// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// CRITICAL: Add .mjs to SOURCE extensions (not asset extensions)
// .mjs files are ES6 modules that need to be transformed/bundled like .js files
config.resolver.sourceExts.push('mjs');

// Keep existing tslib resolver
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'tslib': require.resolve('tslib'),
};

module.exports = config;
