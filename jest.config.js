module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/specs/**/*.test.[jt]s"],
  transform: {
    "^.+\\.[jt]s$": "babel-jest",
  },
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
