/* eslint-env node */

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { FileStore } = require('metro-cache');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Resolve node_modules from workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add shared packages to the module map
config.resolver.extraNodeModules = {
  '@monorepo/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
  '@monorepo/convex': path.resolve(workspaceRoot, 'packages/convex'),
};

// Use file-based cache for better monorepo performance
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, '.metro-cache'),
  }),
];

module.exports = withNativeWind(config, { input: './global.css' });
