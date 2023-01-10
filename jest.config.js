module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    },
    "ts-jest": {
      diagnostics: false
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node",
  testTimeout: 30000
};