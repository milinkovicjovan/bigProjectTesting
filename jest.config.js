module.exports = {
  verbose: true,
  roots: ["<rootDir>/src/", "<rootDir>/src/__tests__"],
  moduleDirectories: ["node_modules", "src/__tests__/"],
  // setupFilesAfterEnv: [require.resolve("./tests/setup-tests.js")],
  moduleFileExtensions: ["js", "json", "vue"],
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  transform: {
    ".*\\.(js)$": "babel-jest",
    ".*\\.(vue)$": "vue-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!axios)/"],
};
