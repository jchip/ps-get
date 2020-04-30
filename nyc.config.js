"use strict";

console.log("nyc.config.js, platform:", process.platform);

const isWindows = process.platform === "win32";

module.exports = {
  extends: ["@istanbuljs/nyc-config-typescript"],
  all: true,
  reporter: ["lcov", "text", "text-summary"],
  exclude: [
    "*clap.js",
    "*clap.ts",
    "coverage",
    "dist",
    "docs",
    "gulpfile.js",
    isWindows ? "src/unix-ps.ts" : "src/win32-ps.ts",
    "test",
    "nyc.config.js",
  ],
  "check-coverage": true,
  ...(isWindows
    ? {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      }
    : {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      }),
  cache: false,
};
