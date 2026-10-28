const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo's default is `null`, and the CLI treats that as "don't use Watchman".
// On macOS the fallback watcher misses saves, so Fast Refresh never runs.
config.resolver.useWatchman = true;

module.exports = config;
