module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/specs/**/*.test.[jt]s"],
  transform: {
    "^.+\\.[jt]s$": "babel-jest",
  },
  transformIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  setupFiles: ['<rootDir>/tests/mjml.setup.ts'],
  moduleNameMapper: {
    '^juice$': 'juice/client.js',
  },
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
